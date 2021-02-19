import got, { Got } from 'got'
import { get } from './http'
import { Entries, Schema, Sync } from './type'
import { resolveEntries } from './resolveEntries'

export type CockpitClient = {
    apiURL: string
    apiToken: string
}

export const cockpitClient = ({ apiURL, apiToken }: CockpitClient) => {
    const client: Got = got.extend({
        prefixUrl: apiURL,
        headers: {
            'Content-Type': 'application/json',
            'Cockpit-Token': apiToken,
        },
        responseType: 'json',
        mutableDefaults: true,
        handlers: [
            (options, next) => {
                if (options.isStream) return next(options)

                return (async () => {
                    try {
                        return await next(options)
                    } catch (error) {
                        const { response } = error

                        let errorMessage = `${options.method} cockpit-type`

                        if (response) {
                            console.error(`Error fetching: ${options.url.pathname}`)
                            errorMessage += ` ${response.statusCode} - ${response.statusMessage}`
                        }

                        throw Error(errorMessage)
                    }
                })()
            },
        ],
    })

    const collections = {
        list: () => get<string[]>(`collections/listCollections`)(client),
        schemas: () => get<Schema[]>(`collections/listCollections/extended`)(client),
        schema: (id: string) => get<Schema>(`collections/collection/${id}`)(client),
        entries: <T>(id: string) => get<Entries<T>>(`collections/entries/${id}?populate=5`)(client),
    }

    const singletons = {
        list: () => get<string[]>(`singletons/listSingletons`)(client),
        schemas: () => get<Schema[]>(`singletons/listSingletons/extended`)(client),
        schema: (id: string) => get<Schema>(`singletons/singleton/${id}`)(client),
        entries: <T>(id: string) => get<Entries<T>>(`singletons/get/${id}?populate=5`)(client),
    }

    const sync = async <C, S>(): Promise<Sync<C, S>> => {
        const [collectionList, singletonList] = await Promise.all([collections.list(), singletons.list()])

        return {
            collections: collectionList.success
                ? await resolveEntries<C>({
                      list: collectionList,
                      entriesFn: collections.entries,
                  })
                : null,
            singletons: singletonList.success
                ? await resolveEntries<S>({
                      list: singletonList,
                      entriesFn: singletons.entries,
                  })
                : null,
        }
    }

    return {
        collections: collections,
        singletons: singletons,
        sync: () => sync(),
    }
}

// export some types
export { Sync, SyncEntry, Entries, Schema, Field } from './type'

export default cockpitClient

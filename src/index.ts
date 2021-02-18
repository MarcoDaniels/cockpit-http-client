import got, { Got } from 'got'
import { get } from './http'
import { Entries, Schema } from './type'

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
        entries: (id: string) => get<Entries>(`collections/entries/${id}?populate=5`)(client),
    }

    const singletons = {
        list: () => get<string[]>(`singletons/listSingletons`)(client),
        schemas: () => get<Schema[]>(`singletons/listSingletons/extended`)(client),
        schema: (id: string) => get<Schema>(`singletons/singleton/${id}`)(client),
        entries: (id: string) => get<Entries>(`singletons/get/${id}?populate=5`)(client),
    }

    return {
        collections: collections,
        singletons: singletons,
        sync: () => 'TODO: implement',
    }
}

export default cockpitClient

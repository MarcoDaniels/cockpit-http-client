import got, { Got } from 'got'
import { sync, SyncAll, SyncSingletons, SyncCollections } from './sync'
import { cockpitSingletons } from './cockpitSingletons'
import { cockpitCollections } from './cockpitCollections'

export type Client = {
    apiURL: string
    apiToken: string
}

export const cockpitClient = ({ apiURL, apiToken }: Client) => {
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

    return {
        collections: cockpitCollections(client),
        singletons: cockpitSingletons(client),
        sync: sync(client),
    }
}

// also export some useful types
export { SyncAll, SyncSingletons, SyncCollections }
export { ResponseResult, ResponseSuccess, ResponseError } from './http'
export { ResultEntries, Schema, Schemas, UnknownObject } from './cockpitTypes'

export default cockpitClient

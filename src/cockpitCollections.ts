import { Got } from 'got'
import { get, ResponseResult, ResponseSuccess } from './http'
import { Entries, Schema } from './cockpitTypes'

export type CockpitCollectionEntry = {
    entries: unknown[]
    total: number
}

export type CockpitCollectionEntries = {
    list: ResponseSuccess<string[]>
    entriesFn: (name: string) => ResponseResult<CockpitCollectionEntry>
}

export const cockpitCollectionEntries = async <T>({ list, entriesFn }: CockpitCollectionEntries): Promise<T> =>
    ((await list.data.reduce(async (entries: Promise<{ [n: string]: CockpitCollectionEntry }>, name) => {
        const result = await entriesFn(name)
        if (result.success) {
            ;(await entries)[name] = {
                entries: result.data.entries,
                total: result.data.total,
            }
        }
        return entries
    }, Promise.resolve<{ [n: string]: CockpitCollectionEntry }>({}))) as unknown) as T

export const cockpitCollections = (client: Got) => ({
    list: () => get<string[]>(`collections/listCollections`)(client),
    schemas: <T>() => get<Schema[] | T>(`collections/listCollections/extended`)(client),
    schema: <T>(id: string) => get<Schema | T>(`collections/collection/${id}`)(client),
    entries: <T>(id: string) => get<Entries<T>>(`collections/entries/${id}?populate=5`)(client),
})

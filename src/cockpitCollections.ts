import { Got } from 'got'
import { get, ResponseResult, ResponseSuccess } from './http'
import { ResultEntries, Schema, Schemas } from './cockpitTypes'

export type CockpitCollectionEntry = {
    entries: unknown[]
    total: number
}

export type CockpitCollectionEntries = {
    list: ResponseSuccess<string[]>
    entriesFn: (name: string, populate: number) => ResponseResult<CockpitCollectionEntry>
    populate: number
}

export const cockpitCollectionEntries = async <T>({
    list,
    entriesFn,
    populate,
}: CockpitCollectionEntries): Promise<T> =>
    ((await list.data.reduce(async (entries: Promise<{ [n: string]: CockpitCollectionEntry }>, name) => {
        const result = await entriesFn(name, populate)
        if (result.success) {
            ;(await entries)[name] = {
                entries: result.data.entries,
                total: result.data.total,
            }
        }
        return entries
    }, Promise.resolve<{ [n: string]: CockpitCollectionEntry }>({}))) as unknown) as T

type CockpitCollections = {
    list: () => ResponseResult<string[]>
    schemas: <S>() => ResponseResult<Schemas<S>>
    schema: <S>(id: string) => ResponseResult<Schema<S>>
    entries: <E>(id: string, populate?: number) => ResponseResult<ResultEntries<E>>
}

export const cockpitCollections = (client: Got): CockpitCollections => ({
    list: () => get<string[]>(`collections/listCollections`)(client),
    schemas: <SchemaFields>() => get<Schemas<SchemaFields>>(`collections/listCollections/extended`)(client),
    schema: <SchemaFields>(id: string) => get<Schema<SchemaFields>>(`collections/collection/${id}`)(client),
    entries: <Entries>(id: string, populate = 1) =>
        get<ResultEntries<Entries>>(`collections/entries/${id}?populate=${populate}`)(client),
})

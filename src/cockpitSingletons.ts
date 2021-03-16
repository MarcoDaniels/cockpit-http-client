import { Got } from 'got'
import { get, ResponseResult, ResponseSuccess } from './http'
import { Schema, Schemas } from './cockpitTypes'

export type CockpitSingletonEntry = {
    list: ResponseSuccess<string[]>
    entriesFn: (name: string, populate: number) => ResponseResult<unknown>
    populate: number
}

export const cockpitSingletonEntry = async <T>({ list, entriesFn, populate }: CockpitSingletonEntry): Promise<T> =>
    ((await list.data.reduce(async (entries: Promise<{ [n: string]: unknown }>, name) => {
        const result = await entriesFn(name, populate)
        if (result.success) {
            ;(await entries)[name] = result.data
        }
        return entries
    }, Promise.resolve<{ [n: string]: unknown }>({}))) as unknown) as T

type CockpitSingletons = {
    list: () => ResponseResult<string[]>
    schemas: <S>() => ResponseResult<Schemas<S>>
    schema: <S>(id: string) => ResponseResult<Schema<S>>
    entry: <E>(id: string, populate?: number) => ResponseResult<E>
}

export const cockpitSingletons = (client: Got): CockpitSingletons => ({
    list: () => get<string[]>(`singletons/listSingletons`)(client),
    schemas: <SchemaFields>() => get<Schemas<SchemaFields>>(`singletons/listSingletons/extended`)(client),
    schema: <SchemaFields>(id: string) => get<Schema<SchemaFields>>(`singletons/singleton/${id}`)(client),
    entry: <Entries>(id: string, populate = 1) => get<Entries>(`singletons/get/${id}?populate=${populate}`)(client),
})

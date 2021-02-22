import { Got } from 'got'
import { get, ResponseResult, ResponseSuccess } from './http'
import { Schema } from './cockpitTypes'

export type CockpitSingletonEntry = {
    list: ResponseSuccess<string[]>
    entriesFn: (name: string) => ResponseResult<unknown>
}

export const cockpitSingletonEntry = async <T>({ list, entriesFn }: CockpitSingletonEntry): Promise<T> =>
    ((await list.data.reduce(async (entries: Promise<{ [n: string]: unknown }>, name) => {
        const result = await entriesFn(name)
        if (result.success) {
            ;(await entries)[name] = result.data
        }
        return entries
    }, Promise.resolve<{ [n: string]: unknown }>({}))) as unknown) as T

export const cockpitSingletons = (client: Got) => ({
    list: () => get<string[]>(`singletons/listSingletons`)(client),
    schemas: <T>() => get<Schema[] | T>(`singletons/listSingletons/extended`)(client),
    schema: <T>(id: string) => get<Schema | T>(`singletons/singleton/${id}`)(client),
    entry: <T>(id: string) => get<T>(`singletons/get/${id}?populate=5`)(client),
})

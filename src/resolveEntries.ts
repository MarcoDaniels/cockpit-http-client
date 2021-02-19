import { Entries } from './type'
import { ResponseResult, ResponseSuccess } from './http'

export type ResolveEntries<T> = {
    list: ResponseSuccess<string[]>
    entriesFn: (name: string) => ResponseResult<Entries<T>>
}

export const resolveEntries = <T>({ list, entriesFn }: ResolveEntries<T>) =>
    Promise.all(
        list.data.map(async (name) => {
            const result = await entriesFn(name)
            if (result.success) {
                return {
                    [name]: {
                        entries: result.data.entries,
                        total: result.data.total,
                    },
                }
            }
            return null
        }),
    )

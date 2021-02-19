import { ResolveEntry } from './type'
import { ResponseResult, ResponseSuccess } from './http'

export type ResolveEntries = {
    list: ResponseSuccess<string[]>
    entriesFn: (name: string) => ResponseResult<ResolveEntry>
}

export const resolveEntries = async <T>({ list, entriesFn }: ResolveEntries) =>
    ((await list.data.reduce(async (entries: Promise<{ [n: string]: ResolveEntry }>, name) => {
        const result = await entriesFn(name)
        if (result.success) {
            ;(await entries)[name] = {
                entries: result.data.entries,
                total: result.data.total,
            }
        }
        return entries
    }, Promise.resolve<{ [n: string]: ResolveEntry }>({}))) as unknown) as T

import { Got } from 'got'
import { cockpitCollections, cockpitCollectionEntries } from './cockpitCollections'
import { cockpitSingletons, cockpitSingletonEntry } from './cockpitSingletons'

export type SyncCollections<C> = C | null

export type SyncSingletons<S> = S | null

export type SyncAll<C, S> = {
    collections: SyncCollections<C>
    singletons: SyncSingletons<S>
}

const syncCollections = <C>(populate: number) => async (client: Got): Promise<SyncCollections<C>> => {
    const collection = cockpitCollections(client)

    const collectionList = await collection.list()

    return collectionList.success
        ? await cockpitCollectionEntries<C>({
              list: collectionList,
              entriesFn: collection.entries,
              populate: populate,
          })
        : null
}

const syncSingletons = <S>(populate: number) => async (client: Got): Promise<SyncSingletons<S>> => {
    const singleton = cockpitSingletons(client)

    const singletonList = await cockpitSingletons(client).list()

    return singletonList.success
        ? await cockpitSingletonEntry<S>({
              list: singletonList,
              entriesFn: singleton.entry,
              populate: populate,
          })
        : null
}

const syncAll = <C, S>(populate: number) => async (client: Got): Promise<SyncAll<C, S>> => ({
    collections: await syncCollections<C>(populate)(client),
    singletons: await syncSingletons<S>(populate)(client),
})

type Sync = {
    collections: <C>(populate?: number) => Promise<SyncCollections<C>>
    singletons: <S>(populate?: number) => Promise<SyncSingletons<S>>
    all: <C, S>(populate?: number) => Promise<SyncAll<C, S>>
}

export const sync = (client: Got): Sync => ({
    collections: <C>(populate = 1) => syncCollections<C>(populate)(client),
    singletons: <S>(populate = 1) => syncSingletons<S>(populate)(client),
    all: <C, S>(populate = 1) => syncAll<C, S>(populate)(client),
})

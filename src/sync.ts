import { Got } from 'got'
import { cockpitCollections, cockpitCollectionEntries } from './cockpitCollections'
import { cockpitSingletons, cockpitSingletonEntry } from './cockpitSingletons'

export type Sync<C, S> = {
    collections: C | null
    singletons: S | null
}

export const sync = (client: Got) => async <Collections, Singletons>(): Promise<Sync<Collections, Singletons>> => {
    const singleton = cockpitSingletons(client)
    const collection = cockpitCollections(client)

    const [collectionList, singletonList] = await Promise.all([collection.list(), singleton.list()])

    return {
        collections: collectionList.success
            ? await cockpitCollectionEntries<Collections>({
                  list: collectionList,
                  entriesFn: collection.entries,
              })
            : null,
        singletons: singletonList.success
            ? await cockpitSingletonEntry<Singletons>({
                  list: singletonList,
                  entriesFn: singleton.entry,
              })
            : null,
    }
}

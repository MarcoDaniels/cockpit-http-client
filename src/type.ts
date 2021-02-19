export type UnknownObject = {
    [key: string]: unknown
}

export type Field = {
    type: string
    name: string
    info?: string
    label?: string
    localize: boolean
    required: boolean
    options?: UnknownObject
}

export type Schema = {
    name: string
    label?: string
    group?: string
    description?: string
    fields: Field[]
}

export type Entries<T> = {
    fields: {
        [key: string]: unknown
    }
    entries: T[]
    total: number
}

export type SyncEntry<T> = {
    [key: string]: {
        entries: T[]
        total: number
    }
}

export type Sync<C, S> = {
    collections: (SyncEntry<C> | null)[] | null
    singletons: (SyncEntry<S> | null)[] | null
}

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

export type ResolveEntry = {
    entries: unknown[]
    total: number
}

export type Sync<C, S> = {
    collections: C | null
    singletons: S | null
}

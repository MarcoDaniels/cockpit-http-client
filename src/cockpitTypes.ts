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
    fields: UnknownObject
    entries: T[]
    total: number
}

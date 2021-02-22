export type UnknownObject = {
    [key: string]: unknown
}

export type Schema<Fields> = {
    name: string
    label?: string
    group?: string
    description?: string
    fields: Fields[]
}

export type Schemas<Fields> = {
    [key: string]: Schema<Fields>
}

export type ResultEntries<Entries> = {
    fields: UnknownObject
    entries: Entries[]
    total: number
}

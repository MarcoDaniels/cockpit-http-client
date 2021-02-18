export type Field = {
    type: string
    name: string
    info?: string
    label?: string
    localize: boolean
    required: boolean
    options?: {
        [key: string]: unknown
    }
}

export type Schema = {
    name: string
    label?: string
    group?: string
    description?: string
    fields: Field[]
}

export type Entry = {
    [key: string]: unknown
}

export type Entries = {
    fields: {
        [key: string]: unknown
    }
    entries: Entry[]
    total: number
}

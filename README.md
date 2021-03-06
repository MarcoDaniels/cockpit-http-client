# cockpit-http-client

[![GitHub release](https://img.shields.io/github/v/release/marcodaniels/cockpit-http-client?include_prereleases)](https://www.npmjs.com/package/cockpit-http-client)
[![Publish](https://github.com/marcodaniels/cockpit-http-client/workflows/Publish/badge.svg)](https://github.com/MarcoDaniels/cockpit-http-client/releases)

> A http-client for your [Cockpit CMS](https://getcockpit.com/) content.

## Usage

`yarn add cockpit-http-client`

`cockpit-http-client` exposes basic get methods for `collections` and `singletons`
including a sync endpoint that syncs all `collections` and `singletons` data.

## Examples

initiate client

```typescript
import { cockpitClient } from 'cockpit-http-client'

const client = cockpitClient({
    apiURL: process.env.COCKPIT_API_URL,
    apiToken: process.env.COCKPIT_API_TOKEN,
})
```

list all collections or singletons

```typescript
// lists collections
const collections = await client.collections.list()

if (collections.success) {
    console.log(collections.data)
}

// lists singletons
const singletons = await client.singletons.list()

if (singletons.success) {
    console.log(singletons.data)
}

// create collection entry
const create = await client.collections.createEntry('myCollection', {
    name: 'Post 1',
    url: 'post-1',
})

if (create.success) {
    console.log(create.data)
}

// update collection entry
const update = await client.collections.updateEntry('myCollection', 'myEntryID', {
    name: 'Post 1',
    url: 'post-1',
})

if (update.success) {
    console.log(update.data)
}
```

for collections and singletons methods the API responds in the format:

```
Succesful response:
{success: true, data: 'your data'}

Error response:
{success: false, message: 'error message'}

```

sync example

```typescript
const data = await client.sync.all()

if (data && data.collections) {
    console.log(data.collections)
}
```

entries and sync methods can take optional types for collections and singletons
check [cockpit-type](https://github.com/MarcoDaniels/cockpit-type) for types generation.

```typescript
const syncCollections = await client.sync.collections<MyCollections>()

const singleton = await client.singletons.entry<MySingleton>('mySingleton')

const update = await client.collections.updateEntry<MyCollection>('myCollection', 'myEntryID', {
    name: 'Post 1',
    url: 'post-1',
})
```

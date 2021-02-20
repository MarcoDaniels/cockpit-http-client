# cockpit-http-client

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
```

for collections and singletons methods the API responds in the format:

```
Succesful response:
{success: true, data: 'your data'}

Error response:
{success: false, message: 'error message'}

```

sync method can take optional types for collections and singletons
check [cockpit-type](https://github.com/MarcoDaniels/cockpit-type) for types generation

```typescript
// const data = await client.sync<MyCollections, MySingletons>()

const data = await client.sync()

if (data && data.collections) {
    console.log(data.collections)
}
```

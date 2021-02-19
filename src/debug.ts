import { cockpitClient } from './index'

const client = cockpitClient({
    apiURL: process.env.COCKPIT_API_URL || '',
    apiToken: process.env.COCKPIT_API_TOKEN || '',
})

const sync = async () => {
    const data = await client.sync<any, any>()
    if (data && data.collections) {
        console.log(data.collections)
    }
}

sync().then(() => console.log('sync'))

import { cockpitClient } from './index'

const run = async () => {
    const client = cockpitClient({
        apiURL: process.env.COCKPIT_API_URL || '',
        apiToken: process.env.COCKPIT_API_TOKEN || '',
    })

    const data = await client.collections.entries(`joyfulPost`)
    if (data.success) {
        console.log(data.data)
    }
}

run().then(() => console.log('done'))

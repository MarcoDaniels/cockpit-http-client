import { cockpitClient } from './index'

const run = async () => {
    const client = cockpitClient({
        apiURL: process.env.COCKPIT_API_URL || '',
        apiToken: process.env.COCKPIT_API_TOKEN || '',
    })

    const data = await client.sync()
    if (data) {
        console.log(data)
    }
}

run().then(() => console.log('done'))

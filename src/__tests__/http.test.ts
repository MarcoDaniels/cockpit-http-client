import test from 'ava'
import nock from 'nock'
import { mockRequest } from './_mocks'
import { get } from '../http'
import got from 'got'

test.afterEach(() => nock.cleanAll())

test('success http get call with modifier response', async (t) => {
    const mockReturnData = { content: 'my content' }

    mockRequest('collections/get/myCollection', mockReturnData)

    const client = got.extend({
        prefixUrl: process.env.COCKPIT_API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Cockpit-Token': process.env.COCKPIT_API_TOKEN,
        },
        responseType: 'json',
        mutableDefaults: true,
    })

    const result = await get<{ content: string }>('collections/get/myCollection')(client)

    t.true(result.success)

    if (result.success) {
        t.deepEqual(result.data, mockReturnData)
    }
})

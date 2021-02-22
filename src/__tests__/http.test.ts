import test from 'ava'
import nock from 'nock'
import { get } from '../http'
import got from 'got'

test.afterEach(() => nock.cleanAll())

test('http get call with success result and modifier response', async (t) => {
    const mockReturnData = { content: 'my content' }

    nock(process.env.COCKPIT_API_URL || '')
        .get(`/collections/get/myCollection`)
        .reply(200, mockReturnData)

    const client = got.extend({
        prefixUrl: process.env.COCKPIT_API_URL,
        responseType: 'json',
    })

    const result = await get<{ content: string }>('collections/get/myCollection')(client)

    t.true(result.success)

    if (result.success) {
        t.deepEqual(result.data, mockReturnData)
    }
})

test('http get call with non success result and error message', async (t) => {
    const client = got.extend({ responseType: 'json' })

    const result = await get('collections/get/myCollection')(client)

    t.false(result.success)

    if (!result.success) {
        t.is(result.message, 'TypeError [ERR_INVALID_URL]: Invalid URL: collections/get/myCollection')
    }
})

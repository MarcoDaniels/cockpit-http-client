import nock = require('nock')
import { Scope } from 'nock'
import got, { Got } from 'got'

export const mockClient: Got = got.extend({
    prefixUrl: process.env.COCKPIT_API_URL,
    responseType: 'json',
})

export const mockRequest = (url: string, result: string | string[] | Record<string, unknown>): Scope =>
    nock(process.env.COCKPIT_API_URL || '')
        .get(`/${url}`)
        .reply(200, result)

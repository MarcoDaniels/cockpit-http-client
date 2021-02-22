import nock = require('nock')
import { Scope } from 'nock'
import got from 'got'

export const mockClient = got.extend({
    prefixUrl: process.env.COCKPIT_API_URL,
    responseType: 'json',
})

export const mockRequest = (url: string, result: string | Record<string, any>): Scope =>
    nock(process.env.COCKPIT_API_URL || '')
        .get(`/${url}`)
        .reply(200, result)

import nock = require('nock')
import { Scope } from 'nock'

export const mockRequest = (url: string, result: Record<string, unknown>): Scope =>
    nock(process.env.COCKPIT_API_URL || '')
        .get(`/${url}`)
        .reply(200, result)
        .persist()

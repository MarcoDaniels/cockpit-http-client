import test from 'ava'
import { sync } from '../sync'
import { mockClient, mockRequest } from './_mocks'

test('sync collections', async (t) => {
    const mockOne = { entries: [{ name: 'my name' }], fields: { name: 'string' }, total: 1 }
    const mockTwo = { fields: { age: 'string' }, entries: [{ age: 'my age' }], total: 1 }

    mockRequest(`collections/listCollections`, ['collectionOne', 'collectionTwo'])
    mockRequest(`collections/entries/collectionOne?populate=1`, mockOne)
    mockRequest(`collections/entries/collectionTwo?populate=1`, mockTwo)

    const syncCollections = await sync(mockClient).collections()

    t.deepEqual(syncCollections, {
        collectionOne: { entries: mockOne.entries, total: mockOne.total },
        collectionTwo: { entries: mockTwo.entries, total: mockTwo.total },
    })
})

test('sync singletons', async (t) => {
    mockRequest(`singletons/listSingletons`, ['singletonOne'])
    mockRequest(`singletons/get/singletonOne?populate=1`, { name: 'string' })

    const syncSingletons = await sync(mockClient).singletons()

    t.deepEqual(syncSingletons, { singletonOne: { name: 'string' } })
})

test('sync all', async (t) => {
    const mockColOne = { entries: [{ name: 'my name' }], fields: { name: 'string' }, total: 1 }
    const mockColTwo = { fields: { age: 'string' }, entries: [{ age: 'my age' }], total: 1 }
    const mockSingOne = { name: 'string' }

    mockRequest(`collections/listCollections`, ['collectionOne', 'collectionTwo'])
    mockRequest(`collections/entries/collectionOne?populate=1`, mockColOne)
    mockRequest(`collections/entries/collectionTwo?populate=1`, mockColTwo)

    mockRequest(`singletons/listSingletons`, ['singletonOne'])
    mockRequest(`singletons/get/singletonOne?populate=1`, mockSingOne)

    const syncAll = await sync(mockClient).all()

    t.deepEqual(syncAll, {
        singletons: { singletonOne: mockSingOne },
        collections: {
            collectionOne: { entries: mockColOne.entries, total: mockColOne.total },
            collectionTwo: { entries: mockColTwo.entries, total: mockColTwo.total },
        },
    })
})

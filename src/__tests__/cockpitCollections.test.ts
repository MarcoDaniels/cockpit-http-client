import test from 'ava'
import { mockClient, mockRequest } from './_mocks'
import { cockpitCollections } from '../cockpitCollections'

test('collections list', async (t) => {
    const mockData = ['item1', 'item2']

    mockRequest(`collections/listCollections`, mockData)

    const collectionsList = await cockpitCollections(mockClient).list()

    t.true(collectionsList.success)
    if (collectionsList.success) {
        t.deepEqual(collectionsList.data, mockData)
    }
})

test('collections schemas', async (t) => {
    const mockData = {
        collection1: { name: 'collection1', fields: [{ name: 'string' }] },
        collection2: { name: 'collection2', fields: [{ name: 'string' }] },
    }

    mockRequest(`collections/listCollections/extended`, mockData)

    const collectionsSchemas = await cockpitCollections(mockClient).schemas()

    t.true(collectionsSchemas.success)
    if (collectionsSchemas.success) {
        t.deepEqual(collectionsSchemas.data, mockData)
    }
})

test('collections schema', async (t) => {
    const mockData = { name: 'collection1', fields: [{ name: 'string' }] }

    mockRequest(`collections/collection/collection1`, mockData)

    const collectionsSchema = await cockpitCollections(mockClient).schema('collection1')

    t.true(collectionsSchema.success)
    if (collectionsSchema.success) {
        t.deepEqual(collectionsSchema.data, mockData)
    }
})

test('collections entries', async (t) => {
    const mockData = {
        fields: { name: 'string' },
        entries: [{ name: 'my name' }],
        total: 1,
    }

    mockRequest(`collections/entries/collection1?populate=5`, mockData)

    const collectionsEntries = await cockpitCollections(mockClient).entries<{ name: string }>('collection1')

    t.true(collectionsEntries.success)
    if (collectionsEntries.success) {
        t.deepEqual(collectionsEntries.data, mockData)
    }
})

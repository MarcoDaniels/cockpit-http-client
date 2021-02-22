import test from 'ava'
import { mockClient, mockRequest } from './_mocks'
import { cockpitSingletons } from '../cockpitSingletons'

test('singletons list', async (t) => {
    const mockData = ['item1', 'item2']

    mockRequest(`singletons/listSingletons`, mockData)

    const singletonsList = await cockpitSingletons(mockClient).list()

    t.true(singletonsList.success)
    if (singletonsList.success) {
        t.deepEqual(singletonsList.data, mockData)
    }
})

test('singletons schemas', async (t) => {
    const mockData = [{ singleton1: { field: true } }, { singleton2: { field: true } }]

    mockRequest(`singletons/listSingletons/extended`, mockData)

    const singletonsSchemas = await cockpitSingletons(mockClient).schemas()

    t.true(singletonsSchemas.success)
    if (singletonsSchemas.success) {
        t.deepEqual(singletonsSchemas.data, mockData)
    }
})

test('singletons schema', async (t) => {
    const mockData = { singleton1: { field: true } }

    mockRequest(`singletons/singleton/singleton1`, mockData)

    const singletonsSchema = await cockpitSingletons(mockClient).schema('singleton1')

    t.true(singletonsSchema.success)
    if (singletonsSchema.success) {
        t.deepEqual(singletonsSchema.data, mockData)
    }
})

test('singletons entry', async (t) => {
    const mockData = { name: 'string' }

    mockRequest(`singletons/get/singleton1?populate=5`, mockData)

    const singletonsEntries = await cockpitSingletons(mockClient).entry<{ name: string }>('singleton1')

    t.true(singletonsEntries.success)
    if (singletonsEntries.success) {
        t.deepEqual(singletonsEntries.data, mockData)
    }
})

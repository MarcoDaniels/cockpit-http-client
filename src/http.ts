import { Got } from 'got'

export type ResponseError = {
    success: false
    message: string
}

export type ResponseSuccess<T> = {
    success: true
    data: T
}

export type ResponseResult<T> = Promise<ResponseSuccess<T> | ResponseError>

export const get = <T>(url: string) => (client: Got): ResponseResult<T> =>
    new Promise((resolve) =>
        client
            .get<T>(url)
            .then((res) => resolve({ success: true, data: res.body }))
            .catch((err) => resolve({ success: false, message: err.toString() })),
    )

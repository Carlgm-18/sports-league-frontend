export type ResponseError = { errorCode: number; errorMessage: string }

export type ApiResult<T> = 
    | { ok: true; data: T }
    | { ok: false; error: ResponseError };
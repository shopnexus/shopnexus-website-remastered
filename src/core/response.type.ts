export type PaginationParams<TEntity = Record<string, any>> = {
  page?: number
  cursor?: string
  limit: number
  order?: 'asc' | 'desc'
  sortBy?: keyof TEntity
} & {
  [K in keyof TEntity]?: TEntity[K]
}
export type SuccessResponse<Data = any> = {
  data: Data
}

export type SuccessPaginationRes<Item> = SuccessResponse<Item[]> & {
  pagination: {
    total: number
    page: number
    limit: number
    next_page?: number
    next_cursor?: string
  }
}

export enum ErrorKey {
  INTERNAL = 'INTERNAL',
  UNAUTHORIZED = 'UNAUTHORIZED',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  PASSWORD_NOT_MATCH = 'PASSWORD_NOT_MATCH',
}

export type TErrorResponse = {
  error: {
    code: ErrorKey
    message: string
  }
}

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customFetchPagination, customFetchStandard } from '@/lib/queryclient/custom-fetch'
import type { PaginationParams, SuccessPaginationRes } from '@/lib/queryclient/response.type'
import qs from 'qs'
import { Resource } from '../shared/resource.type'

export type TComment = {
  id: number
  account: {
    id: number
    name: string
    avatar?: Resource
    verified: boolean
  }
  body: string
  upvote: number
  downvote: number
  score: number
  date_created: string
  date_updated: string
  resources: Resource[]
}

export type ListCommentsParams = PaginationParams<{
  ref_type?: 'ProductSpu' | 'Comment'
  id?: number[]
  account_id?: number[]
  ref_id?: number[]
  score_from?: number
  score_to?: number
}>

export const useListComments = (params: ListCommentsParams) =>
  useInfiniteQuery({
    queryKey: ['comment', 'list', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<TComment>(`catalog/comment?${qs.stringify(pageParam, { arrayFormat: 'repeat' })}`),
    getNextPageParam: (lastPageRes: SuccessPaginationRes<TComment>, _, lastPageParam) => {
      if (!lastPageRes.pagination.next_page && !lastPageRes.pagination.next_cursor) return undefined
      return {
        ...lastPageParam,
        page: lastPageRes.pagination.next_page,
        cursor: lastPageRes.pagination.next_cursor,
        limit: lastPageParam.limit,
      }
    },
    initialPageParam: params,
  })

export type CreateCommentParams = {
  ref_type: 'ProductSpu' | 'Comment'
  ref_id: number
  body: string
  score: number
  resources?: { url: string }[]
}

export const useCreateComment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateCommentParams) =>
      customFetchStandard<TComment>('catalog/comment', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['comment', 'list'] })
    },
  })
}

export type UpdateCommentParams = {
  id: number
  body?: string
  score?: number
  resources?: { url: string }[]
  empty_resources?: boolean
}

export const useUpdateComment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateCommentParams) =>
      customFetchStandard<TComment>('catalog/comment', {
        method: 'PATCH',
        body: JSON.stringify(params),
      }),
    onSuccess: async (_, variables) => {
      await qc.invalidateQueries({ queryKey: ['comment', 'list'] })
      await qc.invalidateQueries({ queryKey: ['comment', 'detail', variables.id] })
    },
  })
}


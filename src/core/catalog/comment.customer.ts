import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customFetchPagination, customFetchStandard } from '@/lib/queryclient/custom-fetch'
import type { PaginationParams, SuccessPaginationRes } from '@/lib/queryclient/response.type'
import qs from 'qs'
import { Resource } from '../common/resource.type'

export type TComment = {
  id: number
  account: {
    id: number
    name: string
    avatar: Resource | null
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

export const useListComments = (params: PaginationParams<{
  ref_type: string
  ref_id: number
  id?: number[]
  account_id?: number[]
  score_from?: number
  score_to?: number
}>) =>
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

export const useCreateComment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      ref_type: string
      ref_id: number
      body: string
      score: number
      resource_ids: string[]
    }) =>
      customFetchStandard<TComment>('catalog/comment', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['comment', 'list'] })
    },
  })
}

export const useUpdateComment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      id: number
      body?: string
      score?: number
      resource_ids?: string[]
      empty_resources?: boolean
    }) =>
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

export const useDeleteComment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { ids: number[] }) =>
      customFetchStandard<{ message: string }>('catalog/comment', {
        method: 'DELETE',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['comment', 'list'] })
    },
  })
}


import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "../../lib/queryclient/custom-fetch"
import QueryString from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"
import { Status } from "../shared/status.type"

type TOrder = {
  id: number
  account_id: number
  payment_gateway: string
  status: Status
  address: string
  date_created: string
  date_updated: string
}

export const useCheckout = () =>
  useMutation({
    mutationKey: ['checkout'],
    mutationFn: (params: {
      address: string
      payment_option: string
      skus: {
        sku_id: number
        promotion_ids: number[]
        shipment_option: string
        note: string
      }[]
    }) => customFetchStandard<{
      order: TOrder
      url: string
    }>(`order/checkout`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  })

export const useListOrders = (params: PaginationParams<{
  account_id?: number
  status?: string
  date_from?: string
  date_to?: string
}>) =>
  useInfiniteQuery({
    queryKey: ['order', 'list', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<TOrder>(`order?${QueryString.stringify(pageParam, { arrayFormat: 'repeat' })}`),
    getNextPageParam: (lastPageRes: SuccessPaginationRes<TOrder>, _, lastPageParam) => {
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
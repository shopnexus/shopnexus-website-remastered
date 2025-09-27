import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type CreateOrderParams = {
  "address": string,
  "payment_gateway": string,
  "sku_ids": number[]
}

export const useCreateOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateOrderParams) =>
      customFetchStandard<TOrder>('catalog/order', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['order'] })
    },
  })
}

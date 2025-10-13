import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type TProductSPU = {

}

export type CreateProductSPUParams = {
  ref_type: 'ProductSpu' | 'Comment'
  ref_id: number
  body: string
  score: number
  resources?: { url: string }[]
}

export const useCreateProductSPU = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateProductSPUParams) =>
      customFetchStandard<TProductSPU>('catalog/product-spu', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['product-spu'] })
    },
  })
}
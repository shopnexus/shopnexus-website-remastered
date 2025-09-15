import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { customFetchStandard } from "../../lib/queryclient/custom-fetch"

export type Promotion = {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
}

export const useGetPromotion = (id?: number) => useQuery({
  queryKey: ['promotion', id],
  queryFn: async () => customFetchStandard<Promotion>(`promotion/${id}`),
  enabled: !!id,
})
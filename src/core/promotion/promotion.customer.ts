import { useSuspenseQuery } from "@tanstack/react-query"
import { customFetchStandard } from "../../lib/queryclient/custom-fetch"

export type Promotion = {
}

export const useGetPromotion = () => useSuspenseQuery({
  queryKey: ['promotion'],
  queryFn: async () => customFetchStandard<Promotion>('promotion/'),
})
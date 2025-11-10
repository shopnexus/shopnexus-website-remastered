import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useQuery } from "@tanstack/react-query"
import qs from "qs"


export type ServiceOption = {
  id: string
  provider: string
  method: string
  name: string
  description: string
}

export const useListServiceOption = (params: {
  category: string
}) =>
  useQuery({
    queryKey: ['service-option', 'list', params],
    queryFn: () => customFetchStandard<ServiceOption[]>(`common/option?${qs.stringify(params)}`),
  })

import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useMutation, useQuery } from "@tanstack/react-query"

export type Analytic = {

}

// "view": 0.1,  # Most common action, lower weight
// "add_to_cart": 0.3,  # Moderate engagement
// "purchase": 0.6,  # Strongest signal, highest weight
// "rating": 0.2  # Explicit feedback, moderate weight
/*
type Interaction struct {
  ID          string                        `json:"id"`
  AccountID   int64                         `json:"account_id"`
  EventType   string                        `json:"event_type"`
  RefType     db.AnalyticInteractionRefType `json:"ref_type"`
  RefID       int64                         `json:"ref_id"`
  Metadata    map[string]any                `json:"metadata,omitempty"`
  DateCreated time.Time                     `json:"date_created"`
}
*/

export type CreateInteractionParams = {
  event_type: 'view' | 'add_to_cart' | 'purchase' | 'rating'
  ref_type: 'Product' | 'Category' | 'Brand' | 'Vendor'
  ref_id: number
  metadata?: Record<string, any>
}

export const useCreateInteraction = () =>
  useMutation({
    mutationFn: async (params: CreateInteractionParams) => customFetchStandard<"OK">('analytic/interaction', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  })

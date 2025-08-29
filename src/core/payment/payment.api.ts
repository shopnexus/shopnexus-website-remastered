import qs from 'qs'
import { customFetchStandard, customFetchPagination } from '../custom-fetch'
import { Payment, CreatePaymentParams, ListPaymentsParams, PatchPaymentParams } from './payment.type'

export async function getPayment(id: Payment['id']) {
  return customFetchStandard<Payment>(`payment/${id}`)
}

export async function listPayments(params: ListPaymentsParams) {
  return customFetchPagination<Payment>(`payment/?${qs.stringify(params)}`, {
    method: 'GET',
  })
}

export async function createPayment(params: CreatePaymentParams) {
  return customFetchStandard<Payment>(`payment`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export async function patchPayment(params: PatchPaymentParams) {
  return customFetchStandard<Payment>(`payment/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

export async function deletePayment(id: Payment['id']) {
  return customFetchStandard<void>(`payment/${id}`, {
    method: 'DELETE',
  })
}

import { PaginationParams } from '../response.type'

export enum PaymentMethod {
  UNKNOWN = 'PAYMENT_METHOD_UNKNOWN',
  VNPAY = 'PAYMENT_METHOD_VNPAY',
  MOMO = 'PAYMENT_METHOD_MOMO',
}

export enum PaymentStatus {
  UNKNOWN = 'PAYMENT_STATUS_UNKNOWN',
  PENDING = 'PAYMENT_STATUS_PENDING',
  SUCCESS = 'PAYMENT_STATUS_SUCCESS',
  CANCELED = 'PAYMENT_STATUS_CANCELED',
  FAILED = 'PAYMENT_STATUS_FAILED',
}

export type Payment = {
  id: string
  account_id: string
  method: PaymentMethod
  status: PaymentStatus
  total: number
  date_created: string
}

export type ListPaymentsParams = PaginationParams<Partial<Omit<Payment, 'id'> & {
  created_from: number
  created_to: number
}>>

export type CreatePaymentParams = Omit<Payment, 'id' | 'account_id' | 'date_created'>

export type PatchPaymentParams = Partial<Omit<Payment, ''> & {
  new_id: string
}>

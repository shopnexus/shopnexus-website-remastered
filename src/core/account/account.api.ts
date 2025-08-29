import { customFetchStandard } from '../custom-fetch'
import {
  Account,
  AccountUser,
  LoginUserParams,
  LoginUserResult,
  PatchAccountParams,
  PatchUserParams,
  RegisterUserParams,
  RegisterUserResult,
} from './account.type'

export async function patchAccount(params: PatchAccountParams) {
  return customFetchStandard<Account>('account', {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

export async function getUser() {
  return customFetchStandard<AccountUser>('account/user')
}

export async function loginUser(params: LoginUserParams) {
  return customFetchStandard<LoginUserResult>('account/user/login', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export async function registerUser(params: RegisterUserParams) {
  return customFetchStandard<RegisterUserResult>('account/user/register', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export async function patchUser(params: PatchUserParams) {
  return customFetchStandard<AccountUser>('account/user', {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

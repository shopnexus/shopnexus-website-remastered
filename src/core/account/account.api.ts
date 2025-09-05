import { customFetchStandard } from '../custom-fetch'
import {
  AccountBase,
  LoginParams,
  LoginResult,
  PatchAccountParams,
} from './account.type'

export async function patchAccount(params: PatchAccountParams) {
  return customFetchStandard<AccountBase>('account', {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

export async function getMe() {
  return customFetchStandard<AccountBase>('account/me')
}

export async function loginBasic(params: LoginParams) {
  const data = await customFetchStandard<LoginResult>('auth/login/basic', {
    method: 'POST',
    body: JSON.stringify(params),
  })

  // TODO: store the token in the http only cookie
  globalThis?.localStorage?.setItem?.('token', data.access_token)

  return data
}

// export async function registerUser(params: RegisterUserParams) {
//   return customFetchStandard<RegisterUserResult>('account/user/register', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   })
// }

// export async function patchUser(params: PatchUserParams) {
//   return customFetchStandard<AccountUser>('account/user', {
//     method: 'PATCH',
//     body: JSON.stringify(params),
//   })
// }

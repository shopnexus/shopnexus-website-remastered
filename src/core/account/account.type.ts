enum AccountType {
  ADMIN = 'ACCOUNT_TYPE_ADMIN',
  USER = 'ACCOUNT_TYPE_USER',
}

export type Account = {
  id: number
  type: AccountType
  username: string
  created_at: number
}

export type AccountUser = {
  id: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  company?: string
  address?: string
}

export type PatchAccountParams = Partial<Omit<Account, 'created_at' | 'id' | 'type'> & {
  new_password: string
}> & {
  current_password: string
}

export type LoginUserParams = {
  id?: number
  username?: string
  email?: string
  phone?: string
  password: string
}

export type LoginUserResult = {
  token: string
  account: Account
}

export type RegisterUserParams = {
  username: string
  password: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
}

export type RegisterUserResult = {
  token: string
  account: Account
}

export type PatchUserParams = Partial<Omit<AccountUser, 'id'>>

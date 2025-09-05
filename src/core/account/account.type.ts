enum AccountType {
  Customer = "Customer",
  Vendor = "Vendor",
}

enum AccountStatus {
  Active = "Active",
  Suspended = "Suspended",
}

export type AccountBase = {
  code: string;
  type: AccountType;      // db.AccountType -> string enum likely
  status: AccountStatus;    // db.AccountStatus -> string enum likely
  phone?: string | null;
  email?: string | null;
  username?: string | null;
  date_created: number;  // Unix timestamp (int64)
  date_updated: number;  // Unix timestamp (int64)
}

export type PatchAccountParams = Partial<Omit<AccountBase, 'date_created' | 'date_updated' | 'type' | 'code' | 'status'> & {
  new_password: string
}> & {
  current_password: string
}

export type LoginParams = {
  id: string
  password: string
}

export type LoginResult = {
  access_token: string
}

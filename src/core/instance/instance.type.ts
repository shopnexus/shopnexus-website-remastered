import { PaginationParams } from '../response.type'

export enum InstanceStatus {
  UNKNOWN = 'STATUS_UNKNOWN',
  PENDING = 'STATUS_PENDING',
  RUNNING = 'STATUS_RUNNING',
  STOPPED = 'STATUS_STOPPED',
  ERROR = 'STATUS_ERROR',
}

export type Instance = {
  id: string
  account_id: string
  os_id: string
  arch_id: string
  region_id: string
  name: string
  cpu: number
  ram: number
  storage: number
  created_at: string
}

export type InstanceMonitor = {
  id: string
  status: InstanceStatus
  cpu_usage: number // in percentage (%)
  ram_usage: number // in MB
  storage_usage: number // in MB
  network_in: number // in MB
  network_out: number // in MB
}

export type ListInstancesParams = PaginationParams<Partial<Omit<Instance, 'created_at'> & {
  created_at_from: number
  created_at_to: number
}>>

export type CreateInstanceParams = {
  basic: {
    name: string
    hostname: string
    os_id: string
    arch_id: string
  }
  resources: {
    memory: number // in MB
    cpu: number // number of cores
    storage: number // in GB
  }
  security: {
    'password': string
    'ssh-authorized-keys': string[]
  }
}

export type CreateInstanceResult = {
  id: Instance['id']
  payment_url: string
}

export type PatchInstanceParams = Partial<Omit<Instance, 'created_at' | 'account_id'>>

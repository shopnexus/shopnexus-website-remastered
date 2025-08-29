import qs from 'qs'
import { customFetchPagination, customFetchStandard } from '../custom-fetch'
import { CreateInstanceParams, CreateInstanceResult, Instance, InstanceMonitor, ListInstancesParams, PatchInstanceParams } from './instance.type'

export async function getInstance(id: Instance['id']) {
  return customFetchStandard<Instance>(`instance/${id}`)
}

export async function getInstanceMonitor(id: Instance['id']) {
  return customFetchStandard<InstanceMonitor>(`instance/${id}/monitor`)
}

export async function listInstances(params: ListInstancesParams) {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
  return customFetchPagination<Instance>(`instance/?${qs.stringify(params)}`, {
    method: 'GET',
  })
}

export async function createInstance(params: CreateInstanceParams) {
  return customFetchStandard<CreateInstanceResult>(`instance`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export async function patchInstance(params: PatchInstanceParams) {
  return customFetchStandard<Instance>(`instance/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  })
}

export async function deleteInstance(id: Instance['id']) {
  return customFetchStandard<void>(`instance/${id}`, {
    method: 'DELETE',
  })
}

export async function startInstance(id: Instance['id']) {
  return customFetchStandard<void>(`instance/start/${id}`, {
    method: 'POST',
  })
}

export async function stopInstance(id: Instance['id']) {
  return customFetchStandard<void>(`instance/stop/${id}`, {
    method: 'POST',
  })
}

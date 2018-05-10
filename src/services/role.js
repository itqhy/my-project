import request from '../utils/request';
import { stringify } from 'qs';

export async function query(params) {
  return request(`/api/role?${stringify(params)}`);
}

export async function add(params) {
  return request('/api/role', {
    method: 'POST',
    body: params
  });
}


export async function remove(params) {
  return request(`/api/role/${params.roleId}`, {
    method: 'DELETE'
  })
}

export async function update(params) {
  return request(`/api/role`, {
    method: 'PUT',
    body: params
  });
}
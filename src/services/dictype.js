import request from '../utils/request';
import { stringify } from 'qs';
export async function query(params) {
  return request(`/api/commonDictype?${stringify(params)}`);
}

export async function add(params) {
  return request('/api/commonDictype', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/commonDictype/${params.id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/api/commonDictype`, {
    method: 'PUT',
    body: params,
  });
}

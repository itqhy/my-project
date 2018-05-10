import request from '../utils/request';
import { stringify } from 'qs';
export async function query(params) {
  return request(`/api/user/api?${stringify(params)}`);
}

export async function add(params) {
  return request('/api/user/api', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/user/api/${params.userId}`, {
    method: 'DELETE',
  });
}

export async function queryTree(params) {
  return request('/api/permission/tree');
}

export async function update(params) {
  return request(`/api/user/api`, {
    method: 'PUT',
    body: params,
  });
}

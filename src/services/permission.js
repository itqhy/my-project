import request from '../utils/request';
import { stringify } from 'qs';
import { json } from 'graphlib';
export async function query(params) {
  return request(`/api/permission/?${stringify(params)}`);
}

export async function add(params) {
  return request('/api/permission', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(`/api/permission/${params.id}`, {
    method: 'DELETE',
  });
}

export async function queryTree(params) {
  return request('/api/permission/tree');
}

export async function update(params) {
  return request(`/api/permission`, {
    method: 'PUT',
    body: params,
  });
}
export async function getRolePermission(id) {
  return request(`/api/permission/role/${id}`);
}

export async function editRolePermission(id, params) {
  console.log(params);
  return request(`/api/permission/${id}`, {
    method: 'PUT',
    body: params
  });
}

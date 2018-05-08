import request from '../utils/request';
import { stringify } from 'qs';
export async function query(params) {
  return request(`/api/user/api?${stringify(params)}`);
}

export async function add(params) {
  return request('/user/add', {
    method: 'POST',
    body: params
  });
}

export async function queryCurrent() {
  return request('/user/currentUser');
}

export async function remove(params) {
  return request('/user/remove', {
    method: 'POST',
    body: params
  })
}

export async function deleteBatch(params) {
  return request('/user/deleteBatch', {
    method: 'POST',
    body: params
  })
}

export async function update(params) {
  return request('/user/update', {
    method: 'POST',
    body: params
  });
}
import {
  query as queryUsers,
  add,
  queryCurrent,
  remove,
  deleteBatch,
  update,
} from '../services/user';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      const dataSource = {
        list: response.records,
        pagination: {
          total: response.total,
          pageSize: response.size || 10,
          current: response.current || 1,
        },
      };
      yield put({ type: 'save', payload: dataSource });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *deleteBatch({ payload, callback }, { call, put }) {
      const response = yield call(deleteBatch, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

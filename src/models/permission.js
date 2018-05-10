import { query, add, remove, update, queryTree } from '../services/permission';

export default {
  namespace: 'permission',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    trees: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
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
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
    },
    *fetTree({ payload }, { call, put }) {
      const response = yield call(queryTree, payload);
      yield put({ type: 'initTree', payload: response });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    initTree(state, action) {
      return {
        ...state,
        trees: action.payload,
      };
    },
  },
};

import { query as queryUsers, add, queryCurrent, remove, deleteBatch, update } from '../services/user';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {}
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
        }
      }
      yield put({ type: 'save', payload: dataSource });
    
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      yield put({ type: 'reload' });
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      yield put({ type: 'reload' });
    },
    *deleteBatch({ payload, callback }, { call, put }) {
      const response = yield call(deleteBatch, payload);
      if (callback) callback(response);
      yield put({ type: 'reload' });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      yield put({ type: 'reload' });
    },
    *reload(_, { call, put, select }) {
      // 删除或修改后，重新定位并刷新数据
      // const currentPage = yield select(state => state.user.data.pagination.current);
      // const pageSize = yield select(state => state.user.data.pagination.pageSize);
      yield put({ type: 'fetch' });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    }
  }
};

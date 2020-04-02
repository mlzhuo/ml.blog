import {
  LOGIN,
  REGISTER,
  SAVE_USER_INFO,
  SAVE_USER_ID,
  SAVE_TOKEN,
  INSERT_LOG,
  EXIT,
  GET_USER_BY_ID
} from "../mutationTypes";
import { Login, Register, getUserById } from "@/api";
import md5 from "md5";
const state = {
  userInfo: {},
  userId: "",
  token: ""
};

const getters = {}

const actions = {
  async [LOGIN](
    { commit, dispatch },
    { username, password, onSuccess, onFailed, onComplete }
  ) {
    const result = await Login({ username, password: md5(password) });
    if (result.state) {
      const { _id, token } = result.data;
      localStorage.setItem("token", token);
      localStorage.setItem("_id", _id);
      commit({ type: SAVE_USER_INFO, userInfo: result.data });
      commit({ type: SAVE_USER_ID, userId: _id });
      commit({ type: SAVE_TOKEN, token });
      onSuccess(result);
      dispatch(INSERT_LOG, { user_id: _id, type: 0 });
    } else {
      onFailed(result);
    }
    onComplete();
  },
  async [REGISTER](
    { commit, dispatch },
    { username, password, onSuccess, onFailed, onComplete }
  ) {
    const result = await Register({ username, password: md5(password) });
    if (result.state) {
      onSuccess(username, password, result);
      const { _id } = result.data;
      dispatch(INSERT_LOG, { user_id: _id, type: 1 });
    } else {
      onFailed(result);
    }
    onComplete();
  },
  async [GET_USER_BY_ID]({ commit, state }, { user_id, onSuccess, onFailed }) {
    const result = await getUserById(user_id);
    if (result.state) {
      commit({ type: SAVE_USER_INFO, userInfo: result.data });
      onSuccess(result.data);
    } else {
      onFailed();
    }
  }
};

const mutations = {
  [SAVE_USER_INFO](state, { userInfo }) {
    state.userInfo = userInfo || {};
  },
  [SAVE_USER_ID](state, { userId }) {
    state.userId = userId;
  },
  [SAVE_TOKEN](state, { token }) {
    state.token = token;
  },
  [EXIT](state) {
    state.userInfo = {};
    state.userId = "";
    state.token = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

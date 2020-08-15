import {
  LOGIN,
  REGISTER,
  SAVE_USER_INFO,
  SAVE_USER_ID,
  SAVE_TOKEN,
  INSERT_LOG,
  EXIT,
  GET_USER_BY_ID,
  CREATE_CATEGORY,
  CREATE_TAG,
  INIT,
} from "../mutationTypes";
import { Login, Register, getUserById, createCategory, createTag } from "@/api";
import md5 from "md5";
const state = {
  userInfo: {},
  userId: "",
  token: "",
};

const getters = {};

const actions = {
  async [INIT]({ commit, dispatch, state }) {
    const token = localStorage.getItem("token");
    const _id = localStorage.getItem("_id");
    if (token && _id) {
      commit({ type: SAVE_TOKEN, token });
      commit({ type: SAVE_USER_ID, user_id: _id });
      if (Object.keys(state.userInfo).length === 0) {
        await dispatch(GET_USER_BY_ID, { user_id: _id });
      }
    }
  },
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
      onSuccess && onSuccess(result.data);
    } else {
      onFailed && onFailed();
    }
  },
  async [CREATE_CATEGORY](
    { commit, state, dispatch },
    { user_id, category_name, onSuccess, onFailed }
  ) {
    const result = await createCategory({ user_id, category_name });
    if (result.state) {
      await dispatch(GET_USER_BY_ID, { user_id });
      onSuccess(result.message);
    } else {
      onFailed();
    }
  },
  async [CREATE_TAG](
    { commit, state, dispatch },
    { user_id, category_id, tag_name, onSuccess, onFailed }
  ) {
    const result = await createTag({ user_id, category_id, tag_name });
    if (result.state) {
      await dispatch(GET_USER_BY_ID, { user_id });
      onSuccess(result.message);
    } else {
      onFailed();
    }
  },
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
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

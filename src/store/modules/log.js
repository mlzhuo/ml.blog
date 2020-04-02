import { INSERT_LOG } from "../mutationTypes";
import { insertLog } from "@/api";
const state = {};

const getters = {};

/**
 * type:
 * 0 登录
 * 1 注册
 */
const actions = {
  [INSERT_LOG]({ commit, state }, { user_id, type }) {
    insertLog({ user_id, type });
  }
};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations
};

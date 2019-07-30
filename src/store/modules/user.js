import { SAVE_USER_INFO, SAVE_TOKEN } from '../mutationTypes';
const state = {
  user_id: '',
  token: ''
};

const getters = {};

const actions = {};

const mutations = {
  [SAVE_USER_INFO](state, payload) {
    const { user_id } = payload;
    state.user_id = user_id;
  },
  [SAVE_TOKEN](state, payload) {
    const { token } = payload;
    state.token = token;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

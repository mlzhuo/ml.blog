import { SAVE_BLOG_LIST } from '../mutationTypes';
const state = {
  blogs: []
};

const getters = {};

const actions = {};

const mutations = {
  [SAVE_BLOG_LIST](state, payload) {
    const { blogs } = payload;
    state.blogs = blogs;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

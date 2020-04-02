import {
  SAVE_BLOG_LIST,
  GET_BLOG,
  GET_CATEGORY,
  STORE_CATEGORY
} from "../mutationTypes";
import { getBlog } from "@/api";
const state = {
  category: [],
  blogs: []
};

const getters = {};

const actions = {
  async [GET_BLOG](
    { commit },
    { user_id, category_id, tag_id, page, pagesize }
  ) {
    const result = await getBlog({
      user_id,
      category_id,
      tag_id,
      page,
      pagesize
    });
    if (result.state) {
      commit(SAVE_BLOG_LIST, { blogs: result.data });
    }
  },
  [GET_CATEGORY]({ rootState, commit }) {
    const { blog_category } = rootState.user.userInfo;
    commit(STORE_CATEGORY, blog_category);
  }
};

const mutations = {
  [SAVE_BLOG_LIST](state, payload) {
    const { blogs } = payload;
    state.blogs = blogs;
  },
  [STORE_CATEGORY](state, category) {
    state.category = category;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

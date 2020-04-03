import {
  SAVE_BLOG_LIST,
  GET_BLOG,
  GET_CATEGORY,
  STORE_CATEGORY,
  VIEW_BLOG,
  LIKE_BLOG,
  GET_BLOG_BY_ID
} from "../mutationTypes";
import { getBlog, getBlogById, viewBlog, likeBlog } from "@/api";
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
  },
  async [GET_BLOG_BY_ID]({ commit }, { blog_id, onSuccess, onFailed }) {
    const result = await getBlogById(blog_id);
    if (result.state) {
      onSuccess(result.data);
    } else {
      onFailed(result);
    }
  },
  [VIEW_BLOG]({ commit }, { blog_id }) {
    viewBlog(blog_id);
  },
  async [LIKE_BLOG]({ commit }, { blog_id, onSuccess, onFailed }) {
    const result = await likeBlog(blog_id);
    if (result.state) {
      onSuccess();
    } else {
      onFailed();
    }
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

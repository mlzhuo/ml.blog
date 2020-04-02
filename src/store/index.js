import Vue from "vue";
import Vuex from "vuex";
import log from "./modules/log";
import user from "./modules/user";
import blog from "./modules/blog";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: { log, user, blog },
  strict: debug
});

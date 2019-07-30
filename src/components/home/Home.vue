<template>
  <div class="home layout">
    <div class="left">
      <Dropdown trigger="click" placement="bottom-start" class="menu-icon" @on-click="dropdownItemClick">
        <a href="javascript:void(0)">
          <Icon type="md-menu" color="#fff" size="25"/>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="add-blog">
            <Icon type="md-create" size="14"/>&nbsp;写博客
          </DropdownItem>
          <DropdownItem name="secret-blog">
            <Icon type="md-eye-off" size="14"/>&nbsp;私密日志
          </DropdownItem>
          <DropdownItem name="draft-box">
            <Icon type="md-folder" size="14"/>&nbsp;草稿箱
          </DropdownItem>
          <DropdownItem name="recycle-bin">
            <Icon type="md-pint" size="14"/>&nbsp;回收站
          </DropdownItem>
          <DropdownItem name="setting" divided>
            <Icon type="md-settings" size="14"/>&nbsp;设置项
          </DropdownItem>
          <DropdownItem name="question">
            <Icon type="md-clipboard" size="14"/>&nbsp;反馈
          </DropdownItem>
          <DropdownItem name="exit">
            <Icon type="md-log-out" size="14"/>&nbsp;退出
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div class="info">
        <div class="user-photo">
          <img src="../../assets/image/ml-blog.png" alt="头像">
        </div>
        <p class="nickname">{{userInfo.username || 'ML BLOG'}}</p>
        <p class="gender">
          <span v-if="userInfo.gender===0">
            <Icon type="md-male"/>&nbsp;&nbsp;&nbsp;
          </span>
          <span v-else-if="userInfo.gender===0">
            <Icon type="md-female"/>&nbsp;&nbsp;&nbsp;
          </span>
          <span>博客等级：Lv1</span>
        </p>
        <p class="signature">{{userInfo.signature || '暂时没有签名'}}</p>
      </div>
      <div class="search">
        <input placeholder="Enter text" class="search-input">
        <Icon type="md-search" class="search-icon" size="20" color="#fff"/>
      </div>
      <div class="category hide-scroll">
        <Menu
          :active-name="activeName"
          :open-names="openNames"
          theme="dark"
          accordion
          @on-select="menuHandleSelect"
          @on-open-change="menuHandleOpen"
        >
          <Submenu :name="item._id" v-for="item in userInfo.blog_category" :key="item._id">
            <template slot="title">
              <Icon type="ios-analytics"/>
              {{item.name}}
            </template>
            <MenuItem
              :name="item._id+'-'+ tag._id"
              v-for="tag in item.blog_tag"
              :key="tag._id"
              :to="menuItemTo"
            >{{tag.name}}</MenuItem>
          </Submenu>
        </Menu>
      </div>
    </div>
    <div class="right scroll">
      <router-view/>
    </div>
  </div>
</template>

<script>
import {
  SAVE_USER_INFO,
  SAVE_TOKEN,
  SAVE_BLOG_LIST
} from "@/store/mutationTypes";
import { getUserById, getBlog } from "@/api";
import { NEED_RE_LOGIN } from "@/constant";
export default {
  data() {
    return {
      userInfo: {},
      activeName: "",
      openNames: []
    };
  },
  created() {
    this.user();
    this.blog({});
  },
  methods: {
    user() {
      const { user_id } = this.$route.params;
      getUserById(user_id)
        .then(result => {
          if (result.state) {
            this.userInfo = result.data;
          }
        })
        .catch(error => {
          console.log(error);
          this.$Notice.error({ title: NEED_RE_LOGIN });
          localStorage.clear();
          this.$store.commit({ type: SAVE_USER_INFO, user_id: "" });
          this.$store.commit({ type: SAVE_TOKEN, token: "" });
          this.$router.replace({ path: `/welcome` });
        });
    },
    dropdownItemClick(name) {
      const { user_id } = this.$route.params;
      switch (name) {
        case "add-blog":
          this.$router.push({ path: `/${user_id}/blog/add` });
          break;
        case "secret-blog":
          break;
        case "draft-box":
          break;
        case "recycle-bin":
          break;
        case "setting":
          this.$router.push({ path: `/${user_id}/settings` });
          break;
        case "question":
          break;
        case "exit":
          sessionStorage.clear();
          this.$store.commit({ type: SAVE_USER_INFO, user_id: "" });
          this.$store.commit({ type: SAVE_TOKEN, token: "" });
          this.$router.replace({ path: `/welcome` });
          break;

        default:
          break;
      }
    },
    menuHandleSelect(name) {
      this.activeName = name;
      // TODO 获取每个tag下的blog
      const ids = name.split("-");
      const category_id = ids[0];
      const tag_id = ids[1];
      this.blog({ category_id, tag_id });
    },
    menuHandleOpen(nameArr) {
      this.openNames = nameArr;
    },
    blog({ category_id, tag_id, page, pagesize }) {
      category_id = category_id || null;
      tag_id = tag_id || null;
      page = page || 1;
      pagesize = pagesize || 10;
      const { user_id } = this.$route.params;
      getBlog({ user_id, category_id, tag_id, page, pagesize })
        .then(result => {
          if (result.state) {
            this.$store.commit({ type: SAVE_BLOG_LIST, blogs: result.data });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    menuItemTo: function() {
      const { user_id } = this.$route.params;
      return `/${user_id}/blogs/`;
    }
  }
};
</script>

<style>
</style>

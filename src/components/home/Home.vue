<template>
  <div class="home layout">
    <div class="left">
      <Dropdown
        trigger="click"
        placement="bottom-start"
        class="menu-icon"
        @on-click="dropdownItemClick"
      >
        <a href="javascript:void(0)">
          <Icon type="md-menu" color="#fff" size="25" />
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="add-blog">
            <Icon type="md-create" size="14" />&nbsp;写博客
          </DropdownItem>
          <DropdownItem name="draft-box">
            <Icon type="md-folder" size="14" />&nbsp;草稿箱
          </DropdownItem>
          <DropdownItem name="recycle-bin">
            <Icon type="md-pint" size="14" />&nbsp;回收站
          </DropdownItem>
          <DropdownItem name="setting" divided>
            <Icon type="md-settings" size="14" />&nbsp;设置项
          </DropdownItem>
          <DropdownItem name="exit">
            <Icon type="md-log-out" size="14" />&nbsp;退出
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div class="info">
        <div class="user-photo">
          <img src="../../assets/image/ml-blog.png" alt="头像" />
        </div>
        <p class="nickname">{{ userInfo.username || "ML BLOG" }}</p>
        <p class="gender" v-if="userInfo.email">
          <!-- <span v-if="userInfo.gender === 0">
            <Icon type="md-male" />&nbsp;&nbsp;&nbsp;
          </span>
          <span v-else-if="userInfo.gender === 0">
            <Icon type="md-female" />&nbsp;&nbsp;&nbsp;
          </span>
          <span>博客等级：Lv1</span> -->
          <span>{{ userInfo.email }}</span>
        </p>
        <p class="signature">{{ userInfo.signature || "" }}</p>
      </div>
      <div class="search">
        <!-- <input placeholder="Enter text" class="search-input" /> -->
        <!-- <Icon type="md-search" class="search-icon" size="20" color="#fff" /> -->
      </div>
      <div class="category hide-scroll">
        <Menu
          :active-name="activeName"
          :open-names="openNames"
          theme="dark"
          accordion
          @on-select="menuHandleSelect"
          @on-open-change="menuHandleOpen"
          v-if="allBlogMenuItem._id"
        >
          <MenuItem :name="allBlogMenuItem._id" :to="menuItemTo"
            ><Icon type="ios-analytics" /> {{ allBlogMenuItem.name }}</MenuItem
          >
          <Submenu
            :name="item._id"
            v-for="item in blogCategory"
            :key="item._id"
          >
            <template slot="title">
              <Icon type="ios-analytics" />
              {{ item.name }}
            </template>
            <MenuItem
              :name="item._id + '-' + tag._id"
              v-for="tag in item.blog_tag"
              :key="tag._id"
              :to="menuItemTo"
              >{{ tag.name }}</MenuItem
            >
          </Submenu>
        </Menu>
      </div>
    </div>
    <div class="right scroll">
      <router-view :categoryId="category_id" :tagId="tag_id" />
    </div>
  </div>
</template>

<script>
import {
  SAVE_USER_INFO,
  SAVE_USER_ID,
  SAVE_TOKEN,
  GET_USER_BY_ID,
  EXIT
} from "@/store/mutationTypes";
import { NEED_RE_LOGIN } from "@/constant";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      userInfo: {},
      allBlogMenuItem: {},
      blogCategory: [],
      activeName: "",
      category_id: "",
      tag_id: "",
      openNames: []
    };
  },
  created() {
    this.user();
  },
  methods: {
    ...mapActions([GET_USER_BY_ID]),
    ...mapMutations([EXIT]),
    user() {
      const { user_id } = this.$route.params;
      const { userInfo } = this.$store.state.user;
      if (Object.keys(userInfo).length) {
        this.userInfo = userInfo;
        this.allBlogMenuItem = userInfo.blog_category[0];
        this.activeName = userInfo.blog_category[0]._id;
        this.blogCategory = userInfo.blog_category.slice(1);
        return;
      }
      this.GET_USER_BY_ID({
        user_id,
        onSuccess: this.getUserByIdSuccess,
        onFailed: this.getUserByIdFailed
      });
    },
    getUserByIdSuccess(userInfo) {
      this.userInfo = userInfo;
      this.allBlogMenuItem = userInfo.blog_category[0];
      this.activeName = userInfo.blog_category[0]._id;
      this.blogCategory = userInfo.blog_category.slice(1);
    },
    getUserByIdFailed() {
      this.$Notice.error({ title: NEED_RE_LOGIN });
      localStorage.clear();
      this.EXIT();
      this.$router.replace({ path: `/welcome` });
    },
    dropdownItemClick(name) {
      const { user_id } = this.$route.params;
      switch (name) {
        case "add-blog":
          this.$router.push({ path: `/${user_id}/blog/add` });
          break;
        case "draft-box":
          break;
        case "recycle-bin":
          break;
        case "setting":
          this.$router.push({ path: `/${user_id}/settings` });
          break;
        case "exit":
          this.EXIT();
          localStorage.removeItem("token");
          localStorage.removeItem("_id");
          this.$router.replace({ path: `/welcome` });
          break;
        default:
          break;
      }
    },
    menuHandleSelect(name) {
      this.activeName = name;
      const ids = name.split("-");
      this.category_id = ids[0];
      this.tag_id = ids[1];
    },
    menuHandleOpen(nameArr) {
      this.openNames = nameArr;
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

<style></style>

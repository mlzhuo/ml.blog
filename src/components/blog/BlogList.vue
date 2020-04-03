<template>
  <div class="content-list">
    <img
      v-if="blogList.length === 0"
      class="nothing"
      src="../../assets/image/nothing.png"
      alt
    />
    <ul class="blog-list" v-else>
      <li v-for="item in blogList" :key="item._id">
        <router-link :to="url + item._id">
          <p class="title text-one-line" v-text="item.title"></p>
        </router-link>
        <p class="info">
          <Button
            to
            size="small"
            class="tag-btn"
            v-for="(item_, index_) in item.tags"
            :key="index_"
            v-text="item_"
          ></Button>
          <span class="date">{{ formatDate(item.date) }}</span>
        </p>
        <!-- <p class="details text-two-lines" v-html="item.content"></p> -->
        <p class="operation">
          <span> <Icon type="md-eye" size="18" /> {{ item.view }} </span>
          <span> <Icon type="md-thumbs-up" size="18" /> {{ item.like }} </span>
          <span> <Icon type="md-text" size="18" /> 100 </span>
        </p>
      </li>
    </ul>
    <Page
      v-if="total > pageSize"
      :total="total"
      :current="currentPage"
      :page-size="pageSize"
      @on-change="pageChange"
      size="small"
      class-name="blog-pagination"
    />
  </div>
</template>

<script>
import { formatDateHours } from "@/utils";
import { GET_BLOG } from "@/store/mutationTypes";
import { mapActions, mapState } from "vuex";
export default {
  props: ["categoryId", "tagId"],
  data() {
    return {
      url: "",
      blogList: [],
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
    this.url = this.$route.fullPath + "/";
  },
  methods: {
    ...mapActions([GET_BLOG]),
    formatDate(str) {
      return formatDateHours(new Date(str));
    },
    getBlogs({ category_id, tag_id, page, pagesize }) {
      category_id = category_id || null;
      tag_id = tag_id || null;
      page = page || 1;
      pagesize = pagesize || 10;
      const { user_id } = this.$route.params;
      this.GET_BLOG({
        user_id,
        category_id,
        tag_id,
        page,
        pagesize
      });
    },
    pageChange(page) {
      this.getBlogs({
        category_id: this.categoryId,
        tag_id: this.tagId,
        page: page
      });
    }
  },
  computed: {
    ...mapState({
      blogs: state => state.blog.blogs.blog,
      total: state => state.blog.blogs.total
    })
  },
  watch: {
    blogs(newVal) {
      const blogList = newVal.map(v => {
        const { custom_tag } = v;
        let tags = [];
        if (custom_tag) {
          tags = tags.concat(custom_tag.split(/,|，/));
        }
        return { ...v, tags };
      });
      this.blogList = blogList;
    },
    tagId: {
      handler(newVal) {
        this.getBlogs({
          category_id: this.categoryId,
          tag_id: this.tagId,
          page: this.currentPage
        });
      },
      immediate: true
    }
  }
};
</script>

<style></style>

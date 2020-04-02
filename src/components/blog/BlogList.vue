<template>
  <div class="content-list">
    <img
      v-if="blogList.length === 0"
      class="nothing"
      src="../../assets/image/nothing.png"
      alt
    />
    <ul v-else>
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
        <p class="details text-two-lines" v-html="item.content"></p>
        <p class="operation">
          <span> <Icon type="md-eye" size="18" /> {{ item.visit }} </span>
          <span> <Icon type="md-thumbs-up" size="18" /> {{ item.like }} </span>
          <span> <Icon type="md-text" size="18" /> 100 </span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { formatDateHours } from "@/utils";
import { GET_CATEGORY } from "@/store/mutationTypes";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      url: "",
      blogList: []
    };
  },
  created() {
    this.url = this.$route.fullPath + "/";
    this.blogList = this.$store.state.blog.blogs;
    this.GET_CATEGORY();
  },
  methods: {
    ...mapActions([GET_CATEGORY]),
    formatDate(str) {
      return formatDateHours(new Date(str));
    }
  },
  computed: {
    ...mapState({
      category: state => state.blog.category || [],
      blogs: state => state.blog.blogs
    })
  },
  watch: {
    blogs(newVal) {
      const blogList = newVal.map(v => {
        const { category_id, tag_id, custom_tag } = v;
        let tags = [];
        if (category_id && tag_id) {
          const category =
            this.category.find(vv => vv._id === category_id) || {};
          if (Object.keys(category).length > 0) {
            const tagTemp = category.blog_tag.find(vvv => vvv._id) === tag_id;
            if (tagTemp) {
              tags.push(tagTemp.name);
            }
          }
        }
        if (custom_tag) {
          tags = tags.concat(custom_tag.split(/,|，/));
        }
        return { ...v, tags };
      });
      this.blogList = blogList;
    }
  }
};
</script>

<style></style>

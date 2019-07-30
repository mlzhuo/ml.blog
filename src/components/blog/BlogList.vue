<template>
  <div class="content-list">
    <img v-if="blogList.length===0" class="nothing" src="../../assets/image/nothing.png" alt>
    <ul v-else>
      <li v-for="item in blogList" :key="item._id">
        <router-link :to="url+item._id">
          <p class="title text-one-line" v-text="item.title"></p>
        </router-link>
        <p class="info">
          <Button
            to
            size="small"
            class="tag-btn"
            v-for="(item_,index_) in item.category"
            :key="index_"
            v-text="item_.title"
          ></Button>
          <span class="date" v-text="item.date"></span>
        </p>
        <p class="details text-two-lines" v-html="item.content"></p>
        <p class="operation">
          <span>
            <Icon type="md-eye" size="18"/>1999
          </span>
          <span>
            <Icon type="md-thumbs-up" size="18"/>100
          </span>
          <span>
            <Icon type="md-text" size="18"/>100
          </span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      blogArr: [
        {
          title: "一定一定一定要坚持把这个博客做完",
          category: [
            {
              title: "技术类",
              tag: [{ title: "Vue" }, { title: "React" }, { title: "RN" }]
            }
          ],
          date: "2019-06-11 17:59",
          datalis:
            "一定一定一定要坚持把这个博客做完一定一定一定要坚一定一定一定要坚持把这完一定一定一定要坚持把这个博客做完一定一定一定要坚持把这个博客做完一定"
        },
        {
          title: "一定一定一定要坚持把这个博客做完一定坚持把这个博客做完",
          category: [
            {
              title: "技术类",
              tag: [{ title: "Vue" }, { title: "React" }, { title: "RN" }]
            },
            {
              title: "博客类",
              tag: [{ title: "博客1" }, { title: "博客2" }, { title: "博客3" }]
            }
          ],
          date: "2019-06-11 12:00",
          datalis:
            "一定一定一定要坚持把这个博客做完一定一定一定要坚一定一定一定要坚持把这完一定一定一定要坚持把这个博客做完"
        }
      ],
      blogList: []
    };
  },
  created() {
    this.url = this.$route.fullPath + "/";
    this.blogList = this.$store.state.blog.blogs;
  },
  computed: {
    getBlogs() {
      return this.$store.state.blog.blogs;
    }
  },
  watch: {
    getBlogs(newVal) {
      this.blogList = newVal;
    }
  }
};
</script>

<style>
</style>

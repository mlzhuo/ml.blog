<template>
  <div class="content-details layout">
    <div class="left">
      <p class="title" v-text="blog.title"></p>
      <p class="info">
        <Button type="text" size="small" class="no-hover">
          <Icon type="md-contact" size="14" />&nbsp;ML
        </Button>
        <Button type="text" size="small" class="no-hover">
          <Icon type="md-eye" size="14" />&nbsp;{{ blog.view }}
        </Button>
        <Button type="text" size="small" @click="likeBlog">
          <Icon type="md-heart-outline" size="14" />&nbsp;{{ blog.like }}
        </Button>
        <Button type="text" size="small" class="no-hover">
          <Icon type="md-alarm" size="14" />
          &nbsp;{{ formatDate(blog.date) }}
        </Button>
      </p>
      <Divider />
      <div class="details scroll">
        <div class="ql-container ql-snow">
          <div class="ql-editor" v-html="blog.content"></div>
        </div>
      </div>
    </div>
    <div class="right scroll">
      <p class="comment-title">评论</p>
      <Form ref="formComment" :model="formComment">
        <FormItem prop="comment">
          <Input
            v-model="formComment.comment"
            type="textarea"
            :autosize="{ minRows: 3 }"
            placeholder="Enter something..."
            class="comment-textarea"
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            class="add-comment-btn"
            @click="addComment"
            size="small"
            long
            >发表评论</Button
          >
        </FormItem>
      </Form>
      <Divider />
      <div class="comment-list">
        <ul>
          <li>
            <div class="item">
              <div class="photo">
                <img src="../../assets/image/ml-blog.png" alt />
              </div>
              <div class="comments">
                <p class="user-date">
                  <span class="text-one-line">ML</span>
                  <span class="text-one-line">06-12</span>
                </p>
                <div class="txt">
                  <p>哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</p>
                </div>
              </div>
            </div>
            <Divider />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateHours } from "@/utils";
import { VIEW_BLOG, LIKE_BLOG, GET_BLOG_BY_ID } from "@/store/mutationTypes";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      blog: {},
      formComment: {
        comment: ""
      }
    };
  },
  created() {
    const { blog_id } = this.$route.params;
    this.VIEW_BLOG({ blog_id });
    this.getBlogById(blog_id);
  },
  methods: {
    ...mapActions([VIEW_BLOG, LIKE_BLOG, GET_BLOG_BY_ID]),
    formatDate(str) {
      return formatDateHours(new Date(str));
    },
    getBlogById(blog_id) {
      this.GET_BLOG_BY_ID({
        blog_id,
        onSuccess: this.getBlogByIdSuccess,
        onFailed: this.getBlogByIdFailed
      });
    },
    getBlogByIdSuccess(blog) {
      this.blog = blog;
    },
    getBlogByIdFailed(result) {},
    likeBlog() {
      this.LIKE_BLOG({
        blog_id: this.blog._id,
        onSuccess: this.likeBlogSuccess,
        onFailed: this.likeBlogFailed
      });
    },
    likeBlogSuccess() {
      this.getBlogById(this.blog._id);
    },
    likeBlogFailed(result) {},
    addComment() {
      if (this.formComment.comment.trim().length === 0) {
        this.resetForm();
        this.$Notice.error({ title: "请输入评论内容" });
        return;
      }
      this.$Notice.success({ title: "评论成功" });
      this.resetForm();
    },
    resetForm() {
      this.$refs["formComment"].resetFields();
    }
  }
};
</script>
<style>
.ql-container.ql-snow {
  border: 0;
}
</style>

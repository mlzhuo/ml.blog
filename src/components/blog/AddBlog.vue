<template>
  <div class="add-blog layout">
    <div class="add-header">
      <Form :model="blogForm">
        <FormItem>
          <Input
            v-model="blogForm.title"
            placeholder="博客标题"
            class="title"
          />
        </FormItem>
        <FormItem>
          <div class="inline-inputs">
            <Select
              v-model="blogForm.category_id"
              clearable
              filterable
              allow-create
              placeholder="分类"
              class="select"
              @on-create="handleCreateCategory"
              @on-change="categoryHandleChange"
              @on-clear="categoryClear"
            >
              <Option
                v-for="category in categoryArr"
                :key="category._id"
                :value="category._id"
                :label="category.name"
              ></Option>
            </Select>
            <Select
              v-model="blogForm.tag_id"
              clearable
              filterable
              allow-create
              placeholder="标签"
              class="select"
              :disabled="isTagSelectDisabled"
              @on-create="handleCreateTag"
            >
              <Option
                v-for="tag in tagArr"
                :key="tag._id"
                :value="tag._id"
                :label="tag.name"
              ></Option>
            </Select>
            <Input
              v-model="blogForm.custom_tag"
              placeholder="自定义标签，多个标签用逗号分开"
              class="custom-tag"
            />
          </div>
        </FormItem>
      </Form>
    </div>
    <div class="add-content">
      <quill-editor
        class="editor"
        ref="myQuillEditor"
        v-model="blogForm.content"
        :options="editorOption"
      ></quill-editor>
    </div>
    <div class="add-footer">
      <Button type="info" @click="addBlog(1)">保存</Button>
      <Button type="success" @click="addBlog(0)">发布</Button>
      <Button type="warning" @click="resetData">重置</Button>
    </div>
  </div>
</template>

<script>
import hljs from "highlight.js";
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
Quill.register("modules/ImageExtend", ImageExtend);
import { insertBlog } from "@/api";
import {
  CREATE_CATEGORY,
  CREATE_TAG,
  INSERT_LOG,
  INIT,
} from "@/store/mutationTypes";
import conf from "@/config";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: "img",
            action: conf.apiGateway + "/upload",
            headers: (xhr) => {
              const token = this.$store.state.user.token;
              xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            },
            response: (res) => {
              return res.data.img;
            },
          },
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              // [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              // [{ script: "sub" }, { script: "super" }],
              // [{ indent: "-1" }, { indent: "+1" }],
              // [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              // [{ font: [] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              // ["clean"],
              // ["link", "image", "video"]
              ["link", "image"],
            ],
            handlers: {
              image: function () {
                QuillWatch.emit(this.quill.id);
              },
            },
          },
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
        },
      },
      categoryArr: [],
      tagArr: [],
      blogForm: {
        title: "",
        category_id: "",
        tag_id: "",
        is_secret: false,
        content: "",
        custom_tag: "",
      },
      isTagSelectDisabled: true,
    };
  },
  created() {
    this.category();
  },
  methods: {
    ...mapActions([CREATE_CATEGORY, CREATE_TAG]),
    category() {
      const { blog_category } = this.$store.state.user.userInfo;
      this.categoryArr = blog_category;
      this.blogForm.category_id = blog_category[0]._id;
    },
    categoryHandleChange(value) {
      this.isTagSelectDisabled =
        value && this.categoryArr[0]._id !== value ? false : true;
      const { blog_tag } = this.categoryArr.find((v) => v._id === value) || {};
      this.tagArr = blog_tag;
    },
    categoryClear() {
      this.tagArr = [];
      this.blogForm.tag_id = "";
    },
    onEditorBlur(editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
    },
    addBlog(state) {
      const { title, category_id, content, tag_id } = this.blogForm;
      if (!title || !content) {
        this.$Notice.error({ title: "请检查输入内容" });
        return;
      }
      const { user_id } = this.$route.params;
      let blog = { user_id, state, ...this.blogForm };
      blog.is_secret = this.blogForm.is_secret ? 1 : 0;
      insertBlog(blog)
        .then((result) => {
          if (result.state) {
            const { _id } = result.data;
            this.$router.replace(`/${user_id}/blogs/${_id}`);
            this.$Notice.success({ title: result.message });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$Notice.error({ title: "发布失败" });
        });
    },
    resetData() {
      this.confirmDiolg("提示", "确认清空所有内容", () => {
        this.blogForm = {
          title: "",
          category_id: "",
          tag_id: "",
          is_secret: false,
          content: "",
        };
      });
    },
    confirmDiolg(title, content, callback) {
      this.$Modal.confirm({
        title,
        content: `<p>${content}</p>`,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          callback && callback();
        },
      });
    },
    handleCreateCategory(query) {
      const { user_id } = this.$route.params;
      this.CREATE_CATEGORY({
        user_id,
        category_name: query,
        onSuccess: this.createCategorySuccess,
        onFailed: this.createCategoryFailed,
      });
    },
    createCategorySuccess(message) {
      this.category();
    },
    createCategoryFailed() {},
    handleCreateTag(query) {
      const { user_id } = this.$route.params;
      this.CREATE_TAG({
        user_id,
        category_id: this.blogForm.category_id,
        tag_name: query,
        onSuccess: this.createCategorySuccess,
        onFailed: this.createCategoryFailed,
      });
    },
  },

  components: {
    quillEditor,
  },
};
</script>

<style></style>

<template>
  <div class="add-blog layout">
    <div class="add-header">
      <Form :model="blogForm">
        <FormItem>
          <Input v-model="blogForm.title" placeholder="博客标题" class="title" />
        </FormItem>
        <FormItem>
          <Select
            v-model="blogForm.category_id"
            clearable
            filterable
            placeholder="分类"
            class="select"
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
          <Select v-model="blogForm.tag_id" clearable filterable placeholder="标签" class="select">
            <Option v-for="tag in tagArr" :key="tag._id" :value="tag._id" :label="tag.name"></Option>
          </Select>
          <i-switch v-model="blogForm.is_secret" size="large" class="switch">
            <span slot="open">私密</span>
            <span slot="close">公开</span>
          </i-switch>
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
import { getCategory, insertBlog } from "@/api";
import conf from "@/config";
export default {
  data() {
    return {
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: "img",
            action: conf.apiGateway + "/upload",
            headers: xhr => {
              const token = this.$store.state.user.token;
              xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            },
            response: res => {
              return res.data.img;
            }
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
              ["link", "image"]
            ],
            handlers: {
              image: function() {
                QuillWatch.emit(this.quill.id);
              }
            }
          },
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      },
      categoryArr: [],
      tagArr: [],
      blogForm: {
        title: "",
        category_id: "",
        tag_id: "",
        is_secret: false,
        content: ""
      }
    };
  },
  created() {
    this.category();
  },
  methods: {
    category() {
      const { user_id } = this.$route.params;
      getCategory(user_id)
        .then(result => {
          if (result.state) {
            this.categoryArr = result.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    categoryHandleChange(value) {
      const { blog_tag } = this.categoryArr.find(v => v._id === value) || {};
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
        .then(result => {
          if (result.state) {
            const { _id } = result.data;
            this.$router.replace(`/${user_id}/blogs/${_id}`);
            this.$Notice.success({ title: result.message });
          }
        })
        .catch(err => {
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
          content: ""
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
        }
      });
    }
  },

  components: {
    quillEditor
  }
};
</script>

<style>
</style>

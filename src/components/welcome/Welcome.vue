<template>
  <div class="welcome">
    <div class="top"></div>
    <div class="bottom">
      <p class="title" v-text="title"></p>
      <p class="description" v-text="description"></p>
      <p class="operation">
        <Button class="regist-btn" type="primary" @click="showRegisModal"
          >注 册</Button
        >
        <Button class="login-btn" type="primary" @click="showLoginModal"
          >登 录</Button
        >
      </p>
    </div>
    <Modal
      v-model="isShowLoginModal"
      width="360"
      :mask-closable="false"
      :footer-hide="true"
      @on-visible-change="handleModalVisible"
    >
      <p slot="header" style="text-align:center">
        <span>LOGIN</span>
      </p>
      <div>
        <Form ref="loginForm" :model="loginForm" :rules="rules">
          <FormItem prop="username">
            <Input
              v-model="loginForm.username"
              prefix="ios-contact"
              placeholder="Enter account"
              style="width: 100%"
            />
          </FormItem>
          <FormItem prop="password">
            <Input
              v-model="loginForm.password"
              prefix="ios-lock"
              type="password"
              placeholder="Enter password"
              style="width: 100%;margin-top: 1rem"
            />
          </FormItem>
          <FormItem>
            <Checkbox v-model="remember" style="margin-top: 1rem"
              >下次自动登录</Checkbox
            >
          </FormItem>
          <FormItem>
            <Button
              type="info"
              size="large"
              long
              :loading="loading"
              @click="handleSubmit('loginForm')"
              style="margin-top: 3rem"
              >{{ loginBtnText }}</Button
            >
          </FormItem>
        </Form>
      </div>
      <div slot="footer"></div>
    </Modal>

    <Modal
      v-model="isShowRegistModal"
      width="360"
      :mask-closable="false"
      :footer-hide="true"
      @on-visible-change="handleModalVisible"
    >
      <p slot="header" style="text-align:center">
        <span>REGIST</span>
      </p>
      <div>
        <Form ref="registForm" :model="registForm" :rules="rules">
          <FormItem prop="username">
            <Input
              v-model="registForm.username"
              prefix="ios-contact"
              placeholder="Enter account"
              style="width: 100%"
            />
          </FormItem>
          <FormItem prop="password">
            <Input
              v-model="registForm.password"
              prefix="ios-lock"
              type="password"
              placeholder="Enter password"
              style="width: 100%;margin-top: 1rem"
            />
          </FormItem>
          <FormItem prop="repassword">
            <Input
              v-model="registForm.repassword"
              prefix="ios-lock"
              type="password"
              placeholder="Enter password"
              style="width: 100%;margin-top: 1rem"
            />
          </FormItem>
          <FormItem>
            <Button
              type="info"
              size="large"
              long
              :loading="loading"
              @click="handleSubmit('registForm')"
              style="margin-top: 3rem"
              >{{ registBtnText }}</Button
            >
          </FormItem>
        </Form>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import {
  LOGIN,
  REGISTER,
  SAVE_USER_INFO,
  SAVE_TOKEN
} from "@/store/mutationTypes";
import { Login, Register } from "@/api";
import {
  LOGIN_ERROR,
  REGISTER_ERROR,
  ENTER_USERNAME,
  ENTER_PASSWORD,
  ENTER_PASSWORD_AGAIN,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_DO_NOT_MATCH
} from "@/constant";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(ENTER_PASSWORD));
      } else {
        if (this.registForm.repassword !== "") {
          this.$refs.registForm.validateField("repassword");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(ENTER_PASSWORD_AGAIN));
      } else if (value !== this.registForm.password) {
        callback(new Error(PASSWORD_DO_NOT_MATCH));
      } else {
        callback();
      }
    };
    return {
      title: "ML BLOG",
      description:
        "一款基于Vue + Vuex + Vue Router， Node + Express， MongoDB的轻量级博客",
      loading: false,
      isShowLoginModal: false,
      isShowRegistModal: false,
      loginBtnText: "登 录",
      registBtnText: "注 册",
      remember: false,
      loginForm: {
        username: "",
        password: ""
      },
      registForm: {
        username: "",
        password: "",
        repassword: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: ENTER_USERNAME,
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            max: 16,
            message: PASSWORD_LENGTH_ERROR,
            trigger: "blur"
          }
        ],
        repassword: [
          {
            validator: validatePassCheck,
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            max: 16,
            message: PASSWORD_LENGTH_ERROR,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    showLoginModal() {
      this.isShowLoginModal = true;
    },
    showRegisModal() {
      this.isShowRegistModal = true;
    },
    handleModalVisible(visible) {
      if (!visible) {
        this.loading = false;
        this.loginBtnText = "登 录";
        this.registBtnText = "注 册";
        this.$refs["loginForm"].resetFields();
        this.$refs["registForm"].resetFields();
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loading = true;
          switch (name) {
            case "loginForm":
              this.login(this.loginForm);
              break;
            case "registForm":
              this.register();
              break;
            default:
              break;
          }
        }
      });
    },
    ...mapActions([REGISTER, LOGIN]),
    login(data) {
      const { username, password } = data;
      this.LOGIN({
        username,
        password,
        onSuccess: this.loginSuccess,
        onFailed: this.loginFailed,
        onComplete: this.loginComplete
      });
    },
    loginSuccess(result) {
      const { _id, token } = result.data;
      localStorage.setItem("token", token);
      localStorage.setItem("_id", _id);
      this.isShowLoginModal = false;
      this.$Notice.success({ title: result.message });
      this.$router.replace({ path: `/${_id}` });
    },
    loginFailed(result) {
      this.$Notice.error({ title: result.message });
    },
    loginComplete() {
      this.loading = false;
    },
    register() {
      const { username, password } = this.registForm;
      this.REGISTER({
        username,
        password,
        onSuccess: this.registerSuccess,
        onFailed: this.registerFailed,
        onComplete: this.registerComplete
      });
    },
    registerSuccess(username, password, result) {
      this.login({ username, password });
      this.$Notice.success({ title: result.message });
      this.isShowRegistModal = false;
    },
    registerFailed(result) {
      this.$Notice.error({ title: result.message });
    },
    registerComplete() {
      this.loading = false;
    }
  }
};
</script>

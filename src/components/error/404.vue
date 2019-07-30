<template>
  <div class="error-page">
    <div class="top page-404"></div>
    <div class="bottom">
      <p class="title" v-text="title"></p>
      <p class="description" v-text="description"></p>
      <p class="operation">
        <Button class="home-btn" type="primary" @click="goHome">首 页</Button>
        <Button class="back-btn" type="primary" @click="goBack">返 回</Button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "ML BLOG",
      description:
        "一款基于Vue + Vuex + Vue Router， Node + Express， MongoDB的轻量级博客",
    };
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    goBack() {
      this.$router.go(-1)
    }
  }
};
</script>

<style>
</style>

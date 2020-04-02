# ml.blog
ML.BLOG是一款基于Vue全家桶， Node + Express， MongoDB的轻量级博客

## 配置文件

在项目目录 **src** 下添加 **config.js**

```js
export default {
  apiGateway: 'http://192.168.1.104:3002/api',
  version: '1.0.0'
}


```

## 安装 & 运行

先安装运行服务端 **[ml.blog.server](https://github.com/mlzhuo/ml.blog.server)**，然后安装运行网页端。

```
npm install
npm start
```
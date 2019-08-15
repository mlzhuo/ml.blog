import Vue from 'vue'
import Router from 'vue-router'

const Page404 = () => import('@/components/error/404')
const Welcome = () => import('@/components/welcome/Welcome')
const Home = () => import('@/components/home/Home')
const BlogList = () => import('@/components/blog/BlogList')
const BlogDetails = () => import('@/components/blog/BlogDetails')
const AddBlog = () => import('@/components/blog/AddBlog')
const AllSetting = () => import('@/components/setting/AllSetting')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/welcome'
    },
    {
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/:user_id',
      component: Home,
      redirect: '/:user_id/blogs',
      children: [
        {
          path: 'blogs',
          component: BlogList
        }
      ]
    },
    {
      path: '/:user_id/blogs/:blog_id',
      component: BlogDetails
    },
    {
      path: '/:user_id/blog/add',
      component: AddBlog
    },
    {
      path: '/:user_id/settings',
      component: AllSetting
    },
    {
      path: '/404',
      component: Page404
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

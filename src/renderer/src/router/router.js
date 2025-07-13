// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Main.vue'
import Articles from '../components/Articles.vue'
import EditArticles from '../components/EditArticles.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles
  }
  ,
  {
    path: '/editArticles',
    name: 'EditArticles',
    component: EditArticles
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

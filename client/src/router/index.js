import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddProduct from '../views/AddProduct.vue'
import EditProduct from '../views/EditProduct.vue'

import RegisterUser from '../views/RegisterUser.vue'
import LoginUser from '../views/LoginUser.vue'

import Session from '../views/Session.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/addproduct',
    name: 'AddProduct',
    component: AddProduct
  },
  {
    path: '/editproduct/:id',
    name: 'EditProduct',
    component: EditProduct
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: RegisterUser
  },
  {
    path: '/login',
    name: 'LoginUser',
    component: LoginUser
  },
  {
    path: '/session',
    name: 'Session',
    component: Session
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

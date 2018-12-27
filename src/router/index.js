import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/views/login/Login'
import Edit from '@/views/edit/Edit'
import Edit1 from '@/views/edit/Edit1'
import Home from '@/views/Home'
import UploadImage from '@/views/components/UploadImage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/edit',
      name: 'Edit',
      component: Edit
    },
    {
      path: '/edit1/:did',
      name: 'Edit1',
      component: Edit1
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/image',
      name: 'UploadImage',
      component: UploadImage
    }
  ]
})

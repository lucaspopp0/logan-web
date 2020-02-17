import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Tasks from '@/components/Tasks'
import Commitments from '@/components/Commitments'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }, {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks
    }, {
      path: '/commitments',
      name: 'Commitments',
      component: Commitments
    }
  ]
})

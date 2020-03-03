import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Tasks from '@/components/Tasks/Main'
import Assignments from '@/components/Assignments/Main'
import Commitments from '@/components/Commitments/Main'

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
      path: '/assignments',
      name: 'Assignments',
      component: Assignments
    }, {
      path: '/commitments',
      name: 'Commitments',
      component: Commitments
    }
  ]
})

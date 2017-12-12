import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/Index'

import Login from '@/page/Login'
import Register from '@/page/Register'

import RecycleIndex from '@/page/RecycleIndex'
import RecycleQues from '@/page/RecycleQues'
import RecycleResult from '@/page/RecycleResult'
import RecycleForm from '@/page/RecycleForm'
import FormSuccess from '@/page/FormSuccess'
import RepairIndex from '@/page/RepairIndex'
import RepairForm from '@/page/RepairForm'
import UserIndex from '@/page/UserIndex'
import RecycleOrder from '@/page/RecycleOrder'
import RepairOrder from '@/page/RepairOrder'
import UserLuck from '@/page/UserLuck'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/recycleIndex',
      name: 'recycleIndex',
      component: RecycleIndex
    },
    {
      path: '/recycleQues/:id',
      name: 'recycleQues',
      component: RecycleQues
    },
    {
      path: '/recycleResult/:id',
      name: 'recycleResult',
      component: RecycleResult
    },
    {
      path: '/recycleForm',
      name: 'recycleForm',
      component: RecycleForm
    },
    {
      path: '/formSuccess/:router',
      name: 'formSuccess',
      component: FormSuccess
    },
    {
      path: '/repairIndex',
      name: 'repairIndex',
      component: RepairIndex
    },
    {
      path: '/repairForm',
      name: 'repairForm',
      component: RepairForm
    },
    {
      path: '/userIndex',
      name: 'userIndex',
      component: UserIndex
    },
    {
      path: '/recycleOrder',
      name: 'recycleOrder',
      component: RecycleOrder
    },
    {
      path: '/repairOrder',
      name: 'repairOrder',
      component: RepairOrder
    },
    {
      path: '/userLuck',
      name: 'userLuck',
      component: UserLuck
    }
    
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/Index'

import Login from '@/page/Login'

import RecoverIndex from '@/page/RecoverIndex'
import RecoverQues from '@/page/RecoverQues'
import RecoverResult from '@/page/RecoverResult'
import RecoverForm from '@/page/RecoverForm'
import FormSuccess from '@/page/FormSuccess'
import RepairIndex from '@/page/RepairIndex'
import RepairForm from '@/page/RepairForm'
import UserIndex from '@/page/UserIndex'
import RecoverOrder from '@/page/RecoverOrder'
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
      path: '/recoverIndex',
      name: 'recoverIndex',
      component: RecoverIndex
    },
    {
      path: '/recoverQues/:id',
      name: 'recoverQues',
      component: RecoverQues
    },
    {
      path: '/recoverResult',
      name: 'recoverResult',
      component: RecoverResult
    },
    {
      path: '/recoverForm',
      name: 'recoverForm',
      component: RecoverForm
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
      path: '/recoverOrder',
      name: 'recoverOrder',
      component: RecoverOrder
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

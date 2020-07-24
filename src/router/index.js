import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* 引入公共方法 */
import { BASE_PATH } from '@/scripts/config'


/* 异步引入路由 */
const Index =() => import('@/components/index')
const Data =() => import('@/components/data')

const routes = [
    {
        path: '/controlboard',
        name: 'index',
        meta: {
            title: 'events',
        },
        component: Index
    },
    {
        path: '/datas',
        name: 'data',
        meta: {
            title: 'data',
        },
        component: Data
    }
]

const router = new Router({
	mode: 'hash',
	base: BASE_PATH,
    routes: routes
})

// router.beforeEach((to, from, next) => {

// })

export default router

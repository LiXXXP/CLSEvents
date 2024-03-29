import Vue from 'vue'
import App from './App.vue'
/* 引入路由 */
import router from './router'
/* 引入公共样式 */
import '@/styles/common.css'
/* 引入 ElementUI */
import { 
    Table, 
    TableColumn, 
    Button, 
    InputNumber, 
    Option, 
    Pagination,
    Row,
    Col
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(InputNumber)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(Row)
Vue.use(Col)

/* 用于低版本浏览器兼容问题 es6语法兼容 */
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

/* 阻止 vue 在启动时生成生产提示 */
Vue.config.productionTip = false

new Vue({
	render: h => h(App),
	router,
}).$mount('#events')

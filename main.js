import Vue from 'vue'
import App from './App'
import store from './store'

import site from './pages/site/home.vue';
Vue.component('site',site);

import my from './pages/my/home.vue'
Vue.component('my',my)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.ignoredElements.push('wx-open-launch-weapp')

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()

 




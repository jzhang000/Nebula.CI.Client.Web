// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引入ant design vue UI component
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

//引入element UI component
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//引入构建Pipeline的图形界面样式
import '@/components/ef/index.css';

Vue.use(Antd)
Vue.use(ElementUI)

//引入blue ocean
import VuePipeline from 'vue-pipeline'
Vue.use(VuePipeline)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
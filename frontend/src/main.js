import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//Import Env
import env from './env.js'

//Import Bootstrap
import 'bootstrap/dist/css/bootstrap.css';

// Import Mixins
import mixinMethods from '@/assets/mixin/methods.js'

// For older browser compatibility
import 'es6-promise'

// Import vue_universal_table
import vueUniversalTable from '@/components/table/vue_universal_table.vue'

// Axios
import Axios from 'axios'
Axios.defaults.baseURL = env.urlStart;
Vue.prototype.$http = Axios; // to run axios, just use this.$http

Vue.config.productionTip = env.productionMode;

Vue.component('vue-universal-table' , vueUniversalTable);

Vue.mixin({
  methods : mixinMethods
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

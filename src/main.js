import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

axios.defaults.timeout = 5000;
Vue.use(VueAxios, axios)


//Components
import App from './App.vue'
import Home from './components/home.vue'
import Servers from './components/servers/index.vue'
import CreateServer from './components/servers/create.vue'
import Images from './components/images/index.vue'
import CreateImage from './components/images/create.vue'
import Flavors from './components/flavors/index.vue'
// import CreateFlavor from './components/flavors/create.vue'



import Toasted from 'vue-toasted';
Vue.use(Toasted)


Vue.use(Buefy)
Vue.config.productionTip = false


const routes = [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/home/servers',
    component: Servers
  },
  {
    path: '/home/servers/create',
    component: CreateServer
  },
  {
    path: '/home/images',
    component: Images
  },
  {
    path: '/home/images/create',
    component: CreateImage
  },
  {
    path: '/home/flavors',
    component: Flavors
  },
];

const router = new VueRouter
({
    mode: 'history',
    routes
})

Vue.use(VueRouter)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

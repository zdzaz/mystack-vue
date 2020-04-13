import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueClipboard from 'vue-clipboard2'
import VueApexCharts from 'vue-apexcharts'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

axios.defaults.timeout = 55000;
Vue.use(VueAxios, axios);
Vue.use(VueClipboard);

//Components
import App from './App.vue'
import Home from './components/home.vue'
import CreateProject from './components/projects/create.vue'
import Servers from './components/servers/index.vue'
import ServerConnection from './components/servers/connection.vue'
import CreateServer from './components/servers/create.vue'
import Images from './components/images/index.vue'
import CreateImage from './components/images/create.vue'
import Flavors from './components/flavors/index.vue'
import Volumes from './components/volumes/index.vue'
import CreateVolume from './components/volumes/create.vue'
import Stacks from './components/heat/index.vue'
import CreateStack from './components/heat/create.vue'
import StackDetail from './components/heat/detail.vue'
// import CreateFlavor from './components/flavors/create.vue'
import Networks from './components/networks/index.vue'
import CreateNetwork from './components/networks/create.vue'



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
    path: '/home/project/create',
    component: CreateProject
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
    path: '/home/servers/connection',
    component: ServerConnection
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
  {
    path: '/home/volumes',
    component: Volumes
  },
  {
    path: '/home/volumes/create',
    component: CreateVolume
  },
  {
    path: '/home/stacks',
    component: Stacks
  },
  {
    path: '/home/stacks/:name/:id',
    component: StackDetail
  },
  {
    path: '/home/stacks/create',
    component: CreateStack
  },
  {
    path: '/home/networks',
    component: Networks
  },
  {
    path: '/home/networks/create',
    component: CreateNetwork
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

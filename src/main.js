import Vue from "vue"
import App from "./App.vue"
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Home from './views/index.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        component: Home
    }
]
const router = new VueRouter({
    mode: "history",
    routes
})
import {initContract} from "./utils"

Vue.config.productionTip = false
window.nearInitPromise = initContract()
    .then(() => {

        new Vue({
            render: h => h(App),
            router
        }).$mount("#app")

    })

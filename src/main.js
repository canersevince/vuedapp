import Vue from "vue"
import App from "./App.vue"

import './index.css'
import store from "@/store";

import {initContract} from "./utils"
import router from "@/router";

Vue.config.productionTip = false
window.nearInitPromise = initContract()
    .then(() => {

        new Vue({
            render: h => h(App),
            router,
            store
        }).$mount("#app")

    })

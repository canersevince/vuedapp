import Vue from "vue"
import VueRouter from 'vue-router'
import Home from "@/views/index";
import Browse from "@/views/browse";
import Admin from "@/views/admin";
import Create from "@/views/create";
import CreateCollection from "@/views/collection_creation";
import store from "@/store";

Vue.use(VueRouter)
const routes = [
    {
        path: "/",
        component: Home
    },
    {
        path: "/browse",
        component: Browse
    },
    {
        path: "/browse/:genre",
        component: Browse
    },
    {
        path: "/admin",
        component: Admin,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: "/create",
        component: Create,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "/create/collection",
        component: CreateCollection,
        meta: {
            requiresAuth: true
        }
    }
]

const router = new VueRouter({
    mode: "history",
    routes
})
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.getAuth || window.walletConnection.isSignedIn()) {
            next()
            return
        }
        next('/')
        console.log('sadge')
    } else {
        next()
    }
})
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (store.getters.getAdmin) {
            next()
            return
        }
        console.log('pepega')
        next('/')
    } else {
        next()
    }
})


export default router

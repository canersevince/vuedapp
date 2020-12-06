/* eslint-disable */
import Vue from "vue"
import VueRouter from 'vue-router'
import store from "@/store";
// eslint-disable
const Home = () => import(/* webpackChunkName: "home" */ '@/views/index.vue')
const Browse = () => import(/* webpackChunkName: "browse" */ '@/views/browse.vue')
const Recent = () => import(/* webpackChunkName: "recent" */ '@/views/recent.vue')
const BrowseCollection = () => import(/* webpackChunkName: "browse-collection" */ '@/views/browse_collections')
const CollectionDetail = () => import(/* webpackChunkName: "collection-detail" */ '@/views/collection_detail.vue')
const MyCollection = () => import(/* webpackChunkName: "collection" */ '@/views/collection.vue')
const Admin = () => import(/* webpackChunkName: "admin" */ '@/views/admin.vue')
const Create = () => import(/* webpackChunkName: "create" */ '@/views/create.vue')
const CreateCollection = () => import(/* webpackChunkName: "collection-creation" */ '@/views/collection_creation.vue')
Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        component: Home
    },
    {
        path: "/recent",
        component: Recent
    },
    {
        path: "/browse",
        component: Browse
    },
    {
        path: "/browse-collections",
        component: BrowseCollection
    },
    {
        path: "/browse-collections/:page",
        component: BrowseCollection
    },
    {
        path: "/collection/:id",
        component: CollectionDetail
    },
    {
        path: "/my_collection",
        component: MyCollection
    },
    {
        path: "/browse/artist/:name/:page",
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
            requiresMinter: true
        }
    },
    {
        path: "/create/collection",
        component: CreateCollection,
        meta: {
            requiresAuth: true,
            requiresMinter: true
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
        next('/')
    } else {
        next()
    }
})
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresMinter)) {
        if (store.getters.getMinter) {
            next()
            return
        }
        next('/')
    } else {
        next()
    }
})

router.beforeEach((to, from, next) => {
    store.commit('showLoader')
    next()
})
router.afterEach(() => {
    setTimeout(() => {
        store.commit('hideLoader')
    }, 500)
})


export default router

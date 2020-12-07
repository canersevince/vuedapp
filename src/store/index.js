import Vue from 'vue'
import Vuex from 'vuex'
import authModule from "@/store/auth";
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        createStep: 1,
        cmcApi: "c806e575-6959-42ba-bea2-d9b8ac77227a",
        isLoading: false,
        userCollection: null
    },
    mutations: {
        saveUserCollection(state, payload){
            state.userCollection = payload
        },
        increaseStep(state) {
            state.createStep++
        },
        decreaseStep(state) {
            state.createStep--
        },
        showLoader(state) {
            state.isLoading = true
        },
        hideLoader(state) {
            state.isLoading = false
        },
        resetStep(state){
            state.createStep = 1
        }
    },
    getters: {
        getStep(state) {
            return state.createStep
        },
        getLoading(state){
            return state.isLoading
        }
    },
    modules: {
        auth: authModule
    }
})

export default store

import Vue from 'vue'
import Vuex from 'vuex'
import authModule from "@/store/auth";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        createStep: 1,
        cmcApi: "c806e575-6959-42ba-bea2-d9b8ac77227a"
    },
    mutations: {
        increaseStep(state) {
            state.createStep++
        },
        decreaseStep(state) {
            state.createStep--
        }
    },
    getters: {
        getStep(state) {
            return state.createStep
        }
    },
    modules: {
        auth: authModule
    }
})

export default store

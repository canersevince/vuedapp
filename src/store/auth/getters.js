export const getters = {
    getAuth(state) {
        return state.auth
    },
    get3Box(state) {
        return state.threeBox
    },
    getAdmin(state) {
        return state.admin
    },
    getLoading(state) {
        return state.isLoading
    },
    getMinter(state) {
        return state.minter
    }
}

export default getters

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
    getMinter(state) {
        return state.minter
    }
}

export default getters

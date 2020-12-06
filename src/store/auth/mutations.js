export const mutations = {
    updateUser(state, payload){
        state.auth = true
        state.user = payload
    },
    update3box(state, payload){
        state.threeBox = payload
    },
    updateAdmin(state, payload){
        state.admin = payload
    },
    updateMinter(state){
        state.minter = true
    }
}

export default mutations

export const actions = {
    login({commit}, payload) {
        commit('updateUser', payload)
    },
    set3Box({commit}, payload) {
        commit('update3box', payload)
    },
    loader({commit}, payload) {
        if (payload === true) {
            commit('showLoader')
        } else {
            commit('hideLoader')
        }
    }
}

export default actions;


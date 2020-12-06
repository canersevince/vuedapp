export const actions = {
    login({commit}, payload){
        commit('updateUser', payload)
    },
    set3Box({commit}, payload){
        commit('update3box', payload)
    }
}

export default actions;


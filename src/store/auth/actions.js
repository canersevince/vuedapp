export const actions = {
    login({commit}, payload){
        commit('updateUser', payload)
    },
    set3Box({commit}, payload){
        commit('update3box', payload)
    },
    loader({commit}, payload){
        console.log('loader action')
        console.log(payload)
        if(payload === true){
            commit('showLoader')
        } else {
            commit('hideLoader')
        }
    }
}

export default actions;


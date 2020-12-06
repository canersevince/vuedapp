import state from "@/store/auth/state";
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export const authModule = {
    state: () => state,
    mutations,
    actions,
    getters
}
export default authModule

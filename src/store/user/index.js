import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import {getCookie} from "@/helpers";

export default {
    state: {
        token: getCookie('AUTH-TOKEN') ,
        userData: JSON.parse(localStorage.getItem('user_data')) || null,
        isBanned: Boolean(getCookie('is_banned')),
        invalidCredentials: Boolean(getCookie('invalid_credentials')),
        profile: null,
        collapsed: false
    },
    actions,
    mutations,
    getters
}
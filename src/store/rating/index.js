import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
    state: {
        user_rating: null,
        user_ratings: {
            reviews: null,
        },
        global_rating: null,
        profile_rating:[],
    },
    actions,
    mutations,
    getters
}
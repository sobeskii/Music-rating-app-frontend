import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
    state: {
        releases: [],
        release: null,
    },
    actions,
    mutations,
    getters
}
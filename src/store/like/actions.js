import axios from "axios";
import router from "@/router";

const addLike = function (context, data) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    return new Promise((resolve, reject) => {
        axios.post('/release/rating/' + data.rating_id + '/toggle', {
            is_like: data.is_like
        })
            .then(response => {
                resolve(response);
                context.commit('updateReview', response.data.data.rating);
            })
            .catch(error => {
                context.commit('retrieveErrors', error.response.error)
                reject(error)
            })
    })
}
const getUserLikes = function (context, id) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    return new Promise((resolve, reject) => {
        axios.get('/user/' + id + '/reactions')
            .then(response => {
                resolve(response)
                context.commit('retrieveUserProfile', response.data.user)
                context.commit('updateUserLikes', response.data.reactions)
            })
            .catch(error => {
                if (error.response?.status == 404) {
                    router.push("/404");
                }
                reject(error)
            })
    })
}

export default {
    addLike,
    getUserLikes
}
import axios from "axios";
import router from "@/router";

const putRating = function (context,data){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
    context.commit('resetErrorState')
    context.commit('resetSuccessState')
    return new Promise((resolve, reject) => {
        axios.put('/release/rating/put/', {
            rating: data.rating,
            review: data.review,
            release_id: data.release_id,
            artist_id: data.artist_id,
            user_id: data.user_id,
        })
            .then(response => {
                resolve(response)
                context.commit('updateUserRating',response.data.data.user_rating)
                context.commit('updateGlobalRating',response.data.data.rating_data)
                context.commit('retrieveSuccess',response.data.success)
            })
            .catch(error => {
                context.commit('retrieveErrors',error.response.data.errors);
            })
    })
}

const deleteRating = function (context,data){
    context.commit('resetErrorState')
    context.commit('resetSuccessState')
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
    return new Promise((resolve, reject) => {
        axios.delete('release/rating/' + data.id + '/delete', {
            release_id: data.release_id,
            artist_id: data.artist_id,
            user_id:data.user_id,
        })
            .then(response => {
                resolve(response)
                context.commit('updateUserRating',{data:response.data.data.user_rating,isDelete: true})
                context.commit('updateGlobalRating',response.data.data.rating_data)
                context.commit('retrieveSuccess',response.data.success)
            })
            .catch(error => {
                context.commit('retrieveErrors',error.response.data.message);
                reject(error)
            })
    })
}
const getUserRating = function (context,id){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    return new Promise((resolve, reject) => {
        axios.get('/user/' + id + '/ratings')
            .then(response => {
                resolve(response)
                context.commit('retrieveUserProfile',response.data.user)
                context.commit('updateUserRatings',response.data.ratings)
            })
            .catch(error => {
                if(error.response.status == 404){
                    router.push("/404");
                }
                reject();
            })
    })
}

export default {
    putRating,
    deleteRating,
    getUserRating
}
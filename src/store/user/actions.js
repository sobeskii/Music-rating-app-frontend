import axios from "axios";
import {deleteCookie} from "@/helpers";

const retrieveUserData = function (context) {
    return new Promise((resolve, reject) => {
        axios.get('/user', {
                headers: {
                    Authorization: 'Bearer ' + context.state.token
                }
            }
        ).then(response => {
            let userData = {
                name: response.data.name,
                role: response.data.role,
                avatar: response.data.spotify_avatar,
                user_id: response.data.id,
                spotify_token: response.data.spotify_token,
                spotify_refresh_token: response.data.spotify_refresh_token,
                spotify_id: response.data.spotify_id
            }
            localStorage.setItem('user_data',JSON.stringify(userData));
            context.commit('retrieveUserData', userData);
            resolve(response);
        })
            .catch(error => {
                context.commit('retrieveErrors', error)
                reject(error)
            })
    })
}
const destroyToken = function(context)  {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token
    if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
            axios.post('/logout')
                .then(response => {
                    localStorage.removeItem('user_data')
                    deleteCookie('AUTH-TOKEN')
                    deleteCookie('XSRF-TOKEN')
                    context.commit('destroyToken')
                    context.commit('destroyUserData')
                    resolve(response)
                })
                .catch(error => {
                    localStorage.removeItem('AUTH-TOKEN')
                    localStorage.removeItem('user_data')
                    deleteCookie('XSRF-TOKEN')
                    context.commit('destroyUserData')
                    context.commit('destroyToken')
                    reject(error)
                })
        })
    }
}
const getUserProfile = function (context,id) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token
        return new Promise((resolve, reject) => {
            axios.get('/user/'+id)
                .then(response => {
                    context.commit('retrieveUserProfile',response.data.user)
                    context.commit('retrieveArtists',response.data.artists)
                    context.commit('retrieveUserDataStats',response.data.stats)
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
}

const getUserRecommendations = function (context){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token
    return new Promise((resolve, reject) => {
        axios.get('/discover_artists/')
            .then(response => {
                console.log(response.data.artists)
                context.commit('retrieveArtists',response.data.artists)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    })
}

const showBannedMessage = function (context){
    context.commit('retrieveErrors',{error: 'User is banned!'});
}
const clearBannedMessage = function (context){
    deleteCookie('is_banned');
}

const resetErrors = function (context) {
    context.commit('resetErrorState');
}
const resetSuccess = function (context) {
    context.commit('resetSuccessState');
}

export default {
    retrieveUserData,
    resetSuccess,
    resetErrors,
    destroyToken,
    showBannedMessage,
    clearBannedMessage,
    getUserProfile,
    getUserRecommendations
}
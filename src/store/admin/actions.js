import axios from "axios";

const retrieveUserList = function (context, query) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;

    axios.get('/admin/users', {params: query})
        .then(response => {
            context.commit('retrieveUsers', response.data)
        })
        .catch(error => {
                console.log(error)
            }
        )
}
const retrieveFlaggedReviewList = function (context, query) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;

    axios.get('/admin/flagged', {params: query})
        .then(response => {
            context.commit('updateUserRatings', response.data)
        })
        .catch(error => {
                console.log(error)
            }
        )
}
const retrieveRuleList = function (context,query){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;

    axios.get('/admin/rules', {params: query})
        .then(response => {
            context.commit('retrieveRules', response.data.data.rules)
        })
        .catch(error => {
                console.log(error)
            }
        )
}
const banUser = function (context, id) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    return new Promise((resolve, reject) => {
        axios.post('/admin/ban', {
            user_id: id
        })
            .then(response => {
                resolve(response);
                context.commit('updateUser', response.data.data.user);
                context.commit('resetErrorState')
                context.commit('resetSuccessState')
                context.commit('retrieveSuccess',response.data.success)
            })
            .catch(error => {
                context.commit('retrieveErrors', error.response)
                reject(error)
            })
    })
}
const unbanUser = function (context, id) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    return new Promise((resolve, reject) => {
        axios.post('/admin/unban', {
            user_id: id
        })
            .then(response => {
                resolve(response);
                context.commit('updateUser', response.data.data.user);
                context.commit('resetErrorState')
                context.commit('resetSuccessState')
                context.commit('retrieveSuccess',response.data.success)
            })
            .catch(error => {
                context.commit('retrieveErrors', error.response.error)
                reject(error)
            })
    })
}
const muteUser = function (context, data) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    return new Promise((resolve, reject) => {
        axios.post('/admin/mute', {
            user_id: data.id,
            time: data.time,
            mute_reason: data.mute_reason,
        })
            .then(response => {
                resolve(response);
                context.commit('updateUser', response.data.data.user);
                context.commit('resetErrorState')
                context.commit('resetSuccessState')
                context.commit('retrieveSuccess',response.data.success)
            })
            .catch(error => {
                context.commit('retrieveErrors', error.response)
                reject(error)
            })
    })
}
const unmuteUser = function (context, data) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    return new Promise((resolve, reject) => {
        axios.post('/admin/unmute', {
            user_id: data.id,
            time: data.time
        })
            .then(response => {
                resolve(response);
                context.commit('updateUser', response.data.data.user);
                context.commit('resetErrorState')
                context.commit('resetSuccessState')
                context.commit('retrieveSuccess',response.data.success)
            })
            .catch(error => {
                context.commit('retrieveErrors', error.response)
                reject(error)
            })
    })
}

const confirmReview = function (context, id) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    context.commit('resetErrorState')
    context.commit('resetSuccessState')
    return new Promise((resolve, reject) => {
        axios.post('/admin/review_revert', {
            rating_id: id,
        })
            .then(response => {
                resolve(response);
                context.commit('removeFlaggedReview', response.data.data.rating);
                context.commit('retrieveSuccess',response.data.success)
            })
            .catch(error => {
                context.commit('retrieveErrors', error.response)
                reject(error)
            })
    })
}

const removeFlaggedReview = function (context,id) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    return new Promise((resolve, reject) => {
        axios.delete('release/rating/'+id+'/delete')
            .then(response => {
                resolve(response);
                context.commit('removeFlaggedReview', response.data.data.user_rating);
                context.commit('resetErrorState')
                context.commit('resetSuccessState')
                context.commit('retrieveSuccess',response.data.success)
            })
            .catch(error => {
                context.commit('retrieveErrors', error.response)
                reject(error)
            })
    })
}

const editRule = function (context,data){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    context.commit('resetErrorState')
    context.commit('resetSuccessState')
    return new Promise((resolve, reject) => {
        axios.put('/admin/rules/'+data.id+'/edit', {
            name:data.name,
            reason:data.reason,
            active:data.active,
            detect_after_count: (data.detect_after_count != null) ? data.detect_after_count : null,
            mute_minutes:  data.mute_minutes,
        })
            .then(response => {
                resolve(response);
                context.commit('updateRule', response.data.data.rule);
                context.commit('retrieveSuccess',response.data.success)
            })
            .catch(error => {
                context.commit('retrieveErrors',error.response.data.errors);
                reject(error)
            })
    })
}

export default {
    retrieveUserList,
    retrieveFlaggedReviewList,
    banUser,
    unbanUser,
    muteUser,
    unmuteUser,
    confirmReview,
    removeFlaggedReview,
    retrieveRuleList,
    editRule,
}
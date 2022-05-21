const retrieveToken = function (state, token) {
    state.token = token
}
const retrieveUserData = function (state, userdata) {
    state.userData = userdata
}
const retrieveErrors = function (state, errors) {
    state.errors = errors
}
const retrieveSuccess = function (state, success) {
    state.success = success
}
const destroyUserData = function (state) {
    state.userData = null
}
const destroyToken = function (state) {
    state.token = null
}
const resetErrorState = function (state) {
    state.errors = {};
}
const resetSuccessState = function (state) {
    state.success = {};
}
const retrieveUserProfile = function (state,data){
    state.profile = data
}

export default {
    retrieveToken,
    retrieveUserData,
    retrieveErrors,
    retrieveSuccess,
    destroyUserData,
    destroyToken,
    resetErrorState,
    resetSuccessState,
    retrieveUserProfile
}
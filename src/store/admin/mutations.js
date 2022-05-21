const retrieveUsers = function (state, users) {
    state.users = users
}
const retrieveRules = function (state,rules){
    state.rules = rules
}
const updateUser = function (state,data) {
    const index = state.users.users.data.findIndex(item => item.id == data.id)
    state.users.users.data.splice(index, 1, data)
}
const addRule = function (state,data){
    state.rules.data.push(data);
}
const updateRule = function (state,data) {
    const index = state.rules.data.findIndex(item => item.id == data.id)
    state.rules.data.splice(index, 1, data)
}
const destroyRule = function (state,data) {
    const index = state.rules.data.findIndex(item => item.id == data.id)
    state.rules.data.splice(index, 1)
}
export default {
    retrieveUsers,
    updateUser,
    retrieveRules,
    addRule,
    updateRule,
    destroyRule
}
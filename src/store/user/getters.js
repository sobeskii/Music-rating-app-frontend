const loggedIn = function (state) {
    return state.token !== null
};
const getUserData = function (state) {
    return state.userData || null
};

export default {
    loggedIn,
    getUserData,
};
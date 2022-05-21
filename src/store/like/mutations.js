const updateUserLikes = function (state, data) {
    if(data != null) {
        state.likes = data;
    }
}

export default {
    updateUserLikes
}
const updateUserRating = function (state, data,isDelete = false) {
        state.user_rating = {
            rating: (data?.rating != null) ? data?.rating : 0,
            review:(data?.review != null) ? data?.review : null,
            release_id: data?.release_id,
            artist_id: data?.artist_id,
            user_id: (data?.user_id != null) ? data.user_id : null,
            id: (data?.id != null) ? data.id : null,
        }

}
const updateGlobalRating = function (state, data) {
    if(data != null) {
        state.global_rating = {
            average: data.average,
            count: data.count,
            reviews: data.reviews,
            distribution: data.distribution,
        }
    }
}

const clearGlobalRating = function (state){
    state.global_rating = {
        average: 0,
        count: 0,
        reviews: [],
        distribution: [],
    }
}

const clearReleases = function (state){
    state.releases = [];
}

const retrieveUserDataStats = function (state,data){
    state.profile_rating = data;
}

const updateReview = function (state,data) {
    const index = state.global_rating.reviews.findIndex(item => item.id == data.id)
    state.global_rating.reviews.splice(index, 1, data)
}
const updateUserRatings = function (state, data) {
    if(data != null) {
        state.user_ratings = data;
    }
}
const removeFlaggedReview = function (state,data) {
    const index = state.user_ratings.reviews.data.findIndex(item => item.id == data.id)
    state.user_ratings.reviews.data.splice(index, 1);
}

const updateFlaggedReviewUser = function (state,data) {
    const index = state.user_ratings.reviews.data.findIndex(item => item.user.id == data.id)
    state.user_ratings.reviews.data[index].user = data;
}
export default {
    updateUserRating,
    updateGlobalRating,
    updateReview,
    updateUserRatings,
    updateFlaggedReviewUser,
    removeFlaggedReview,
    clearGlobalRating,
    clearReleases,
    retrieveUserDataStats
}
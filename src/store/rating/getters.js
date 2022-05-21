const distribution = function (state){
    let labels = [ 0.5,1,1.5,2,2.5,3,3.5,4,4.5,5];

    let values = []

    labels.forEach(element =>{
        let el_key = labels.indexOf(element)
        values[el_key] = 0;
        Object.entries(state.global_rating.distribution).forEach(obj => {
            const [key, value] = obj;
            if(element == parseFloat(key)){
                values[el_key] = value.rating_count;
            }
        })
    });

    return values
}

const availableReviews = function (state,getters,rootState){
    if(state.global_rating != null) {
        if (state.global_rating.reviews.length > 0) {
            if(rootState.user.userData != null)
            {
                let itemIndex = state.global_rating.reviews.findIndex(review => rootState.user.userData.user_id == review.user_id);
                if (itemIndex != -1) {
                    let element = state.global_rating.reviews[itemIndex];
                    state.global_rating.reviews.splice(itemIndex, 1);
                    state.global_rating.reviews.splice(0, 0, element);
                }
            }
            let adminCheck = (rootState.user.userData != null)   ?   rootState.user.userData.role.role == 'admin'    :   false;
            let userCheck = (rootState.user.userData != null)   ?   rootState.user.userData.user_id     :   -1;

            return state.global_rating.reviews.filter(
                review => (!review.isFlagged || userCheck == review.user_id) || adminCheck
            );
        } else {
            return [];
        }
    }
}

const availableUserReviews = function (state,getters,rootState) {
    if(state.user_ratings != null) {
        if (state.user_ratings.length > 0) {
            if(rootState.user.userData != null)
            {
                console.log(":)");

                let itemIndex = state.user_ratings.findIndex(review => rootState.user.userData.user_id == review.user_id);
                if (itemIndex != -1) {
                    let element = state.user_ratings[itemIndex];
                    state.user_ratings.splice(itemIndex, 1);
                    state.user_ratings.splice(0, 0, element);
                }
            }
            let adminCheck = (rootState.user.userData != null)   ?   rootState.user.userData.role.role == 'admin'    :   false;
            let userCheck = (rootState.user.userData != null)   ?   rootState.user.userData.user_id     :   -1;

            return state.user_ratings.filter(
                review => (!review.isFlagged || userCheck == review.user_id) || adminCheck
            );
        } else {
            return [];
        }
    }
}

export default {
    distribution,
    availableReviews,
    availableUserReviews
}
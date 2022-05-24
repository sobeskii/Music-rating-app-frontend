import axios from "axios";
import router from "@/router";

const retrieveReleases = function (context, query) {
    axios.get('/search', {params: query})
        .then(response => {
            context.commit('retrieveReleases', response.data)
        })
        .catch(error => {
                console.log(error)
            }
        )
}
const retrieveBestRatedReleases = function (context, query) {
    axios.get('/release/charts', {params: query})
        .then(response => {
            context.commit('clearReleases');
            context.commit('retrieveReleases', response.data)
        })
        .catch(error => {
                console.log(error)
            }
        )
}
const retrieveTopAllTimeReleases = function (context) {
    axios.get('/top_releases')
        .then(response => {
            context.commit('retrieveReleases', response.data)
        })
        .catch(error => {
                console.log(error)
            }
        )
}

const retrieveRelease = function (context, id) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.rootState.user.token;
    axios.get('/release/' + id)
        .then(response => {
            let user_rating = {
                release_id: response.data.release.spotify_id,
                artist_id: response.data.primary_artist.spotify_id,
                user_id: response.data.user_rating_data.user_id,
                rating: response.data.user_rating_data.rating,
                review: response.data.user_rating_data.review,
                id: response.data.user_rating_data.id,
            }
            context.commit('clearGlobalRating');

            context.commit('retrieveRelease', response.data.release);
            context.commit('retrieveArtist', response.data.primary_artist);
            context.commit('updateGlobalRating', response.data.rating_data);
            context.commit('updateUserRating', user_rating);
        })
        .catch(error => {
            if (error.response?.status == 404) {
                router.push("/404");
            }
            console.log(error)
        })
}

export default {
    retrieveReleases,
    retrieveRelease,
    retrieveBestRatedReleases,
    retrieveTopAllTimeReleases
}
import axios from "axios";
import router from "@/router";

const retrieveArtists = function (context) {
    axios.get('/artists')
        .then(response => {
            context.commit('retrieveArtists', response.data)
        })
        .catch(error => {
            console.log(error)
        })
}
const retrieveArtist = function (context, id) {
    axios.get('/artist/' + id)
        .then(response => {
            context.commit('retrieveArtist', response.data.artist);
            context.commit('retrieveReleases', response.data.artist_releases);
            context.commit('retrieveRelease', null);
            context.commit('updateGlobalRating', null);
        })
        .catch(error => {
            if (error.response?.status == 404) {
                router.push("/404");
            }
            console.log(error)
        })
}

export default {
    retrieveArtist,
    retrieveArtists
}
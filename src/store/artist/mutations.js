const retrieveArtists = function (state, artists) {
    state.artists = artists
}
const retrieveArtist = function (state, artist) {
    state.artist = artist
}

export default {
    retrieveArtists,
    retrieveArtist
}
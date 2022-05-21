const retrieveReleases = function (state, releases) {
    state.releases = releases
}
const retrieveRelease = function (state, release) {
    state.release = release
}
export default {
    retrieveReleases,
    retrieveRelease
}
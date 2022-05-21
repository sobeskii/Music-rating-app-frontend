import {createStore} from 'vuex'
import axios from 'axios'
import user from "./user";
import release from "./release";
import artist from "./artist";
import rating from "./rating";
import like from "./like";
import admin from "./admin";
import NProgress from 'nprogress';

axios.defaults.baseURL = "http://localhost:8000/api"

axios.interceptors.request.use(function (config) {
    NProgress.start();
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    NProgress.done();
    return response;
}, function (error) {
    NProgress.done();
    return Promise.reject(error);
});

export default createStore({
    modules: {
        user,
        release,
        artist,
        rating,
        like,
        admin,
    }
})


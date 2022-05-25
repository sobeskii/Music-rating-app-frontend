import {createApp} from 'vue'
import App from './Start.vue'
import router from './router'
import store from './store'
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
library.add(fas)
import './styles/app.css';
import axios from "axios";
window.$ = window.jQuery = require('jquery');


router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? to.meta.title : "Some Default Title"
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.loggedIn) {
            next({
                name: 'home',
            })
        } else {
            next()
        }
    } else if (to.matched.some(record => record.meta.requiresVisitor)) {
        if (store.getters.loggedIn) {
            next({
                name: 'home',
            })
        } else {
            next()
        }
    }else if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (store?.getters?.getUserData?.role?.role != 'admin') {
            next({
                name: 'home',
            })
        } else {
            next()
        }
    }

    else {
        next()
    }

})

createApp(App)
    .use(store)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')

axios.interceptors.response.use(null,function (error) {
    if(error.response.status === 401){
        store.dispatch('destroyToken');
        router.push('/');
    }
    return Promise.reject(error);
});
require('./bootstrap');
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import draggable from 'vuedraggable'

Vue.use(VueRouter);
Vue.use(Vuelidate);
Vue.use(draggable);

import App from './components/App'
import ShowDesk from './components/desks/ShowDesk'

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'showDesk',
            component: ShowDesk,
            props: true
        }
    ]
});


const app = new Vue({
    el: '#app',
    components: {App},
    router
});

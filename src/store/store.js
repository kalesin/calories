import Vue from 'vue';
import Vuex from 'vuex';

import searchAndAdd from './modules/searchAndAdd'
import firebase from './modules/firebase'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        searchAndAdd: searchAndAdd,
        firebase: firebase,
    }
});
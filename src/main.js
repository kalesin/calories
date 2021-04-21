import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Vuetify from 'vuetify';

import App from './App.vue'
import { routes } from './routes';
import store from './store/store';

import firebase from 'firebase'
import vuetify from './plugins/vuetify';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuetify);

Vue.http.options.root = 'https://vuejs-stock-trader-f7694.firebaseio.com/';

Vue.filter('currency', (value) => {
  return '$' + value.toLocaleString();
})

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  created() {
    var config = {
      apiKey: "AIzaSyBWmS0w_Ex_mNBKzyvsNHVLqju97_q30ns",
      authDomain: "vuejs-stock-trader-f7694.firebaseapp.com",
      databaseURL: "https://vuejs-stock-trader-f7694.firebaseio.com",
      projectId: "vuejs-stock-trader-f7694",
      storageBucket: "vuejs-stock-trader-f7694.appspot.com",
      messagingSenderId: "738625718881",
      appId: "1:738625718881:web:3b444ca61121336de7b820",
      measurementId: "G-JQ12LXEBCS"
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(user => {
      if (user && user.uid) {
        this.$store.dispatch("firebase/setUser", user)
        this.$store.dispatch("firebase/getData").then(() => {
          this.$store.dispatch("firebase/setData", true)
        }
        ).catch(function (error) {
          console.log(error);
        })
      } else {
        this.$store.dispatch("firebase/setAuth", true)
        if (this.$router.currentRoute.path !== "/auth") {
          this.$router.push('/auth')
        }
      }
    });
  },
  store,
  vuetify,
  el: '#app',
  render: h => h(App)
})

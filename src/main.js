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

Vue.http.options.root = 'https://caloriecounter-309316-default-rtdb.firebaseio.com/';

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
      apiKey: "AIzaSyD07CNC69O6OSJnLKLVImFabSmQ751uQsA",
      authDomain: "caloriecounter-309316.firebaseapp.com",
      databaseURL: "https://caloriecounter-309316-default-rtdb.firebaseio.com",
      projectId: "caloriecounter-309316",
      storageBucket: "caloriecounter-309316.appspot.com",
      messagingSenderId: "586033597299",
      appId: "1:586033597299:web:3d01bbc528cfe54f319306",
      measurementId: "G-486MLZ10L8"
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(user => {
      if (user && user.uid) {
        var newUser = user.metadata.creationTime === user.metadata.lastSignInTime ? true : false;
        console.log(user)
        console.log(newUser)
        this.$store.dispatch("firebase/setUser", user)
        this.$store.dispatch("firebase/getData").then(() => {
          this.$store.dispatch("firebase/setData", true)
          if (newUser) {
            this.$store.dispatch("firebase/setNewUser", newUser)
            if (this.$router.currentRoute.path !== '/me') {
              this.$router.push('/me')
            }
          } else {
            if (this.$router.currentRoute.path == '/' || this.$router.currentRoute.path == '') {
              this.$router.push('/calories')
            }
          }

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

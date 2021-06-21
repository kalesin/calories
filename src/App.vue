<template>
  <div id="app">
    <v-app>
      <div v-if="!setData && !setAuth"></div>
      <div v-else class="auth d-flex">
        <router-view
          class="router pa-3"
          :class="{ noNavBar: hide, fullscreen: setAuth }"
        ></router-view>
        <app-header
          v-if="userID"
          class="header"
          @hide="setHide"
          :class="{ hide: hide }"
        ></app-header>
      </div>
    </v-app>
  </div>
</template>

<script>
import firebase from "firebase";
import Header from "./components/Header";

import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "app",
  computed: {
    ...mapState("firebase", ["password", "email", "loggedIn", "userData"]),
  },
  created() {
    var user = firebase.auth().currentUser;
    if (user) {
      this.user = user;
    }
  },
  data() {
    return {
      photo: "",
      userId: "",
      name: "",
      user: {},
      hide: false,
    };
  },
  components: {
    appHeader: Header,
  },
  computed: {
    setData: {
      get() {
        return this.$store.state.firebase.setData;
      },
      set(value) {
        this.$store.dispatch("firebase/setData", value);
      },
    },
    setAuth: {
      get() {
        return this.$store.state.firebase.setAuth;
      },
      set(value) {
        this.$store.dispatch("firebase/setAuth", value);
      },
    },
    userID: {
      get() {
        return this.$store.state.firebase.userID;
      },
      set(value) {
        this.$store.dispatch("firebase/setUser", value);
      },
    },
  },
  methods: {
    ...mapActions("firebase", ["setUserID", "getData"]),
    ...mapActions("searchAndAdd", ["setNavbarActive"]),
    setHide(value) {
      this.hide = value;
      this.setNavbarActive(value);
    },
  },
};
</script>

<style>
html {
  height: 100vh;
}
body {
  height: 100%
  }
</style>

<style scoped>


.v-application--wrap.v-application--wrap {
  flex-direction: row;
}
.slide-enter-active {
  animation: slide-in 200ms ease-out forwards;
}
.slide-leave-active {
  animation: slide-out 200ms ease-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0px);
    opacity: 1;
  }
  to {
    transform: translateY(-30px);
    opacity: 0;
  }
}

.auth {
  width: 100%;
}
.header {
  width: 250px;
  height: 100vh;
  animation-name: slide-in;
  animation-duration: 0.5s;
}
.fullscreen {
  width: 100vw !important;
}

.router {
  width: calc(100% - 250px);
  height: 100vh;
}
@media only screen and (max-width: 1350px) {
  .header {
    width: 58px !important;
  }
  .router {
    width: calc(100% - 58px);
  }
}
@media only screen and (max-width: 769px) {
  .header {
    height: calc(100vh + 496px + 12px) !important;
  }
  .auth {
    height: calc(100vh + 496px + 12px) !important;
  }
  .noNavBar {
    width: 100% !important;
  }
}
@keyframes slide-in {
  from {
    transform: translateX(0px);
    opacity: 0;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
}
@keyframes slide-out {
  from {
    transform: translateX(0px);
    opacity: 1;
  }
  to {
    transform: translateX(0px);
    opacity: 0;
  }
}
</style>

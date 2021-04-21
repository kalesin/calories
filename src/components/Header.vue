<template>
  <v-navigation-drawer
    permanent
    @transitionend="checkInput"
    @input="setInput"
    right
  >
    <v-list-item class="appText">
      <v-list-item-content>
        <v-list-item-title class="title text-center" style="font-size: 25px"
          >Calorie Counter</v-list-item-title
        >
        <v-list-item-subtitle class="text-center"
          >Welcome, {{ user.displayName }}!</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>

    <router-link to="/me" activeClass="active" tag="div">
      <v-list-item v-if="user.photoURL" class="py-2 avatar" link>
        <v-list-item-avatar class="d-flex ma-auto">
          <v-img :src="`${user.photoURL}`" contain></v-img>
        </v-list-item-avatar>
      </v-list-item>
      <v-list-item v-else class="py-2 avatar" link>
        <v-list-item-icon class="d-flex ma-auto">
          <v-icon class="active-icon" large>mdi-account-circle</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </router-link>

    <router-link
      v-for="item in logout"
      :key="item.title"
      :to="item.url"
      activeClass="active"
      tag="div"
    >
      <v-list-item link @click="logOut()">
        <v-list-item-icon>
          <v-icon class="active-icon">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="active-text">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </router-link>

    <v-divider></v-divider>

    <v-list dense nav>
      <router-link
        v-for="item in items"
        :key="item.title"
        :to="item.url"
        activeClass="active"
        tag="div"
      >
        <v-list-item link>
          <v-list-item-icon>
            <v-icon class="active-icon">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content class="active-text">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import firebase from "firebase";

export default {
  data() {
    return {
      items: [
        /* 
        {
          title: "My Account",
          icon: "mdi-account-circle",
          url: "/me"
        }, */
        {
          title: "Entries",
          icon: "mdi-food-fork-drink",
          url: "/calories",
        },
        {
          title: "Calendar",
          icon: "mdi-calendar-multiselect",
          url: "/calendar",
        },
      ],
      logout: [{ title: "Log Out", icon: "mdi-login", url: "/auth" }],
      right: null,
      isDropdownOpen: false,
      input: false,
    };
  },
  computed: {
    ...mapState("firebase", [
      "password",
      "email",
      "loggedIn",
      "userData",
      "userID",
      "user",
    ]),
  },
  methods: {
    ...mapActions("firebase", [
      "setPassword",
      "setEmail",
      "setLoggedIn",
      "setUser",
      "setUserID",
    ]),
    logOut() {
      this.setUserID(false);
      firebase.auth().signOut();
    },
    setInput(value) {
      this.input = value;
      if (this.input) {
        this.$emit("hide", false);
      }
    },
    checkInput() {
      if (!this.input) {
        this.$emit("hide", true);
      }
    },
  },
};
</script>

<style scoped>
@media only screen and (max-width: 1350px) {
  .avatar {
    padding: 0;
  }
  .appText {
    display: none;
  }
}
.active {
  background-color: gray;
}
.active .active-text > div {
  color: rgb(204, 204, 204);
  font-weight: 900;
}
.active .active-icon {
  color: rgb(204, 204, 204);
}
</style>
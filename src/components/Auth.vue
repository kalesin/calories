<template lang="html">
  <div id="firebaseui-auth-container"></div>
</template>

<script>
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "auth",
  mounted() {
    var google = new firebase.auth.GoogleAuthProvider();
    var email = new firebase.auth.EmailAuthProvider();
    var fb = new firebase.auth.FacebookAuthProvider();
    var uiConfig = {
      signInFlow: "popup",
      signInSuccessUrl: "/calories",
      signInOptions: [
        {
          provider: google.providerId,
          customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: "select_account"
          }
        },
        { provider: email.providerId},
        {
          provider: fb.providerId,
          customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: "select_account"
          }
        },
      ]
    };
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>

<style scoped>
#firebaseui-auth-container ul {
display: flex !important;
flex-direction: column !important;
}
.firebaseui-idp-list {
  padding-left: 0 !important;
}
.v-application ul{
  padding-left: 0 !important;
}
</style>
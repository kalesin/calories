<template>
  <div>
    <div v-if="provider == 'password'">
      <div class="flex-column mt-4 ml-4" style="width: 400px">
        <v-btn color="success" @click="setOpenEmail()">CHANGE EMAIL</v-btn>
        <div v-if="openEmail" class="d-flex mt-8">
          <v-form
            ref="form"
            v-model="valid1"
            lazy-validation
            class="flex-column flex-grow-1"
          >
            <v-text-field
              required
              dense
              outlined
              type="password"
              maxlength="50"
              v-model="currentPassword"
              label="Current Password"
            ></v-text-field>
            <v-text-field
              counter="30"
              :rules="emailRules"
              required
              maxlength="50"
              dense
              outlined
              type="text"
              label="New Email"
              v-model="email"
            ></v-text-field>
          </v-form>
          <v-btn
            class="ml-2"
            icon
            large
            color="green"
            @click="
              changeEmail(currentPassword, email);
              setOpenEmail();
            "
          >
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="flex-column mt-4 ml-4" style="width: 400px">
        <v-btn color="success" @click="setOpenPassword()"
          >CHANGE PASSWORD</v-btn
        >
        <div v-if="openPassword" class="d-flex mt-8">
          <v-form
            ref="form"
            v-model="valid2"
            lazy-validation
            class="flex-column flex-grow-1"
          >
            <v-text-field
              required
              dense
              outlined
              type="password"
              maxlength="30"
              v-model="currentPassword"
              label="Current Password"
            ></v-text-field>
            <v-text-field
              :rules="passwordRules"
              required
              dense
              outlined
              type="password"
              maxlength="30"
              v-model="password"
              label="New Password"
            ></v-text-field>
            <v-text-field
              :rules="repeatPasswordRules"
              required
              dense
              outlined
              type="password"
              maxlength="30"
              v-model="repeatPassword"
              label="Repeat New Password"
            ></v-text-field>
          </v-form>
          <v-btn
            class="ml-2"
            icon
            large
            color="green"
            @click="
              changePassword(currentPassword, password);
              setOpenPassword();
            "
          >
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <div class="flex-column mt-4 ml-4" style="width: 300px">
      <v-btn color="success" @click="setOpenCalories()"
        >SET MAINTENANCE CALORIES</v-btn
      >
      <div v-if="openCalories" class="d-flex mt-8 mr-4">
        <v-text-field
          type="number"
          dense
          outlined
          label="Maintenance Calories"
          v-model="calories"
          @keyup.enter="
            setMaintenanceCalories(calories);
            setOpenCalories();
          "
        ></v-text-field>
        <v-btn
          class="ml-2"
          icon
          large
          color="green"
          @click="
            setMaintenanceCalories(calories);
            setOpenCalories();
          "
          :disabled="parseFloat(calories) <= 0 || calories === ''"
        >
          <v-icon>mdi-check-bold</v-icon>
        </v-btn>
      </div>
    </div>
    <!-- <div class="flex-column mt-4 ml-4" style="width: 300px">
      <v-btn color="success" @click="setOpenAvatar()">SET AVATAR</v-btn>
      <div v-if="openAvatar" class="d-flex mt-8 mr-4">
        <v-file-input
          :rules="avatarRules"
          accept="image/png, image/jpeg, image/bmp"
          prepend-icon="mdi-camera"
          label="Avatar"
        ></v-file-input>
        <v-btn class="ml-2" icon large color="green" @click="setOpenAvatar()">
          <v-icon>mdi-check-bold</v-icon>
        </v-btn>
      </div>
    </div> -->
    <div class="flex-column mt-4 ml-4" style="width: 100%">
      <v-btn color="success" @click="setOpenTutorial()">TUTORIAL</v-btn>
      <div v-if="openTutorial" class="d-flex mt-8">
        <v-card tile flat>
          <v-card-text class="text-h4 text-left"> Welcome to Calorie Counter!</v-card-text>
          <v-card-text class="text-subtitle-1 text-left">
            This app is for
            reaching your body weight goals! The first step when logging your
            calorie intake should be determining your target body weight and the
            amount of calories you should be eating in day to reach that goal.
            Using this online tool will help you determine the amount of
            calories you should aim for:
            <strong
              ><a href="https://www.calculator.net/calorie-calculator.html">
                Calorie Calculator</a
              ></strong
            >, of course everybody is different so you will need to monitor your
            intake and body weight while you diet and make changes accordingly!
          </v-card-text>
          <v-card-text class="text-h4 text-left"> Entries </v-card-text>
          <v-card-text class="text-subtitle-1 text-left">
            The entries page is the interface for adding foods to the current
            day or any other date, you have the options to add food to 4
            different meals: Breakfast, Lunch, Dinner and Snacks. You can drag
            foods between meals and make your own recipes! After you have
            created a recipe add it to your meals or favorite it and access it
            easily!
            <br />
            <br />
            Adding recipes is meant to be used for
            <strong
              ><a href="https://sweetpeasandsaffron.com/how-to-meal-prep/"
                >meal prepping food</a
              ></strong
            >
            or cooking larger meals multiple times a day which are split into
            portions. For example making a meal with 1kg of chicken breast,
            vegetables, 500 g of rice, olive oil, etc. and splitting it into 4
            portions. This way you can control your portion size with the same
            number of calories in every meal and prepare food in advance! It is
            advisable to purchase a kitchen scale for best results with meal
            prepping.
          </v-card-text>
          <v-card-text class="text-h4 text-left"> Calendar </v-card-text
          ><v-card-text class="text-subtitle-1 text-left">
            The calendar page is the monthly overview of your progress each day,
            use it to track your progress easily! By clicking on the date you
            can edit that day's added items.
          </v-card-text>
          <br />
          <v-card-text class="text-subtitle-1 text-left">
            Thank you for using Calorie Counter!
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import firebase from "firebase";

export default {
  mounted() {
    this.provider = firebase.auth().currentUser.providerData[0].providerId;
    this.email = firebase.auth().currentUser.email;
    if (this.newUser) {
      this.setOpenTutorial();
    }
  },

  watch: {
    openCalories: {
      handler() {
        for (const key of [0, ""]) {
          if (this.calories == key) {
            this.calories = this.maintenanceCalories;
          }
        }
      },
    },
  },
  data() {
    return {
      openCalories: false,
      openEmail: false,
      openPassword: false,
      openAvatar: false,
      openTutorial: false,
      calories: 0,
      valid1: false,
      valid2: false,
      password: "",
      repeatPassword: "",
      currentPassword: "",
      provider: "",
      email: "",

      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.split(" ").length < 2 || `Password can't contain spaces`,
        (v) =>
          (v && v.length >= 6) || "Password must be more than 6 characters",
        /*  v =>
          v
            .split("")
            .map(a => parseFloat(a))
            .filter(a => !Number.isNaN(a)).length > 0 ||
          "Password must contain atleast 1 number" */
        /* v => v.split('').filter(a=>a==a.toUpperCase()&&!(a.toUpperCase()==a.toLowerCase())).length > 0 || 'Password must contain atleast 1 uppercase character', */
      ],
      repeatPasswordRules: [(v) => v == this.password],
      emailRules: [
        (v) => v.length <= 50 || "Max 50 characters",
        (v) => v != "" || "Email can't be empty",
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      avatarRules: [
        (v) =>
          !v || v.size < 2000000 || "Avatar size should be less than 2 MB!",
      ],
    };
  },
  computed: {
    ...mapState("firebase", ["loggedIn", "userData", "userID","newUser"]),
    ...mapState("searchAndAdd", ["maintenanceCalories"]),
  },
  methods: {
    ...mapActions("firebase", [
      "setPassword",
      "setEmail",
      "setLoggedIn",
      "setUserID",
    ]),
    ...mapActions("searchAndAdd", ["setMaintenanceCalories"]),
    setOpenCalories() {
      this.openCalories = !this.openCalories;
    },
    setOpenEmail(value) {
      this.openEmail = !this.openEmail;
    },
    setOpenPassword() {
      this.openPassword = !this.openPassword;
    },
    setOpenTutorial() {
      this.openTutorial = !this.openTutorial;
    },
    setOpenAvatar() {
      this.openAvatar = !this.openAvatar;
    },
    validate() {
      this.$refs.form.validate();
    },

    reauthenticate(currentPassword) {
      var user = firebase.auth().currentUser;
      var cred = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      return user.reauthenticateWithCredential(cred);
    },
    changePassword(currentPassword, newPassword) {
      this.reauthenticate(currentPassword)
        .then(() => {
          var user = firebase.auth().currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              console.log("Password updated!");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
      this.currentPassword = "";
    },
    changeEmail(currentPassword, newEmail) {
      this.reauthenticate(currentPassword)
        .then(() => {
          var user = firebase.auth().currentUser;
          user
            .updateEmail(newEmail)
            .then(() => {
              console.log("Email updated!");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
      this.currentPassword = "";
    },
  },
};
</script>
<template>
  <v-card outlined class="pa-0 rounded-lg recipeBox">
    <div class="d-flex justify-space-around">
      <div class="ma-auto progressCircle">
        <v-progress-circular
          :size="100"
          :width="25"
          :rotate="90"
          :value="recipeProgress"
          color="cyan darken-1"
          >{{ Math.round(recipeProgress) }} %</v-progress-circular
        >
      </div>
      <div class="total">
        <div>
          <v-card-text
            class="text-center text-h4 pa-0 pt-2 font-weight-bold totalText"
            >Recipe total:</v-card-text
          >
          <v-card-text class="text-center text-h4 pa-0 pt-2 totalAmountText"
            >{{ nutrientArray[0] }} kcal</v-card-text
          >
        </div>
        <div class="d-flex justify-space-between nutrient">
          <div v-for="(item, index) in ingredientArray" :key="index">
            <v-card-text
              class="text-center text-subtitle-1 font-weight-bold pa-1 nutrientText"
              >{{ item }}:</v-card-text
            >
            <v-card-text class="text-center pa-1 nutrientAmountText"
              >{{ nutrientArray[index + 1] }} g</v-card-text
            >
          </div>
        </div>
      </div>

      <div class="d-flex ma-auto buttonContainer">
        <v-btn
          class="mt-2"
          v-if="editIndex == -2"
          icon
          x-large
          color="cyan darken-1"
          @click="
            validate();
            submitNewRecipe();
            updateRecipes();
          "
          :disabled="!valid || addedItemsRecipe.length == 0"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn
          class="mt-2"
          v-else
          icon
          x-large
          color="cyan darken-1"
          @click="
            validate();
            submitChangedRecipe();
            updateRecipes();
          "
          :disabled="!valid || addedItemsRecipe.length == 0 || !isSame"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn
          class="mt-2"
          :disabled="editIndex == -2"
          icon
          x-large
          color="red"
          @click="
            removeRecipe({ index: editIndex });
            updateRecipes();
          "
        >
          <v-icon @click.stop="shownIndex = editIndex">mdi-delete</v-icon>
        </v-btn>
        <slot></slot>
      </div>
    </div>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      class="d-flex mx-4 mt-4 mb-0 justify-space-around"
    >
      <v-text-field
        class="input"
        counter="30"
        :rules="nameRules"
        required
        maxlength="30"
        dense
        outlined
        type="text"
        label="Recipe name"
        v-model="recipesName"
      ></v-text-field>
      <v-text-field
        :rules="portionsRules"
        required
        class="input"
        dense
        outlined
        type="number"
        step="1"
        v-model="recipesPortions"
        label="Portions"
      ></v-text-field>
    </v-form>
    <DeleteDialogue
      v-if="shownIndex >= 0"
      @close="shownIndex = -1"
      :index="shownIndex"
      :entry="false"
    ></DeleteDialogue>
  </v-card>
</template>

<script>
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";
import DeleteDialogue from "./DeleteDialogue";

export default {
  components: {
    DeleteDialogue,
  },
  mounted() {
    this.validate();
  },
  props: ["nutrientArray"],
  data() {
    return {
      activeIndex: -1,
      showDialogue: false,
      valid: false,
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 30 || "Max 30 characters",
        (v) => v != "" || "Name can't be empty",
      ],
      portionsRules: [
        (v) => !!v || "Portions are required",
        (v) => v >= 1 || "Portions can't be - or 0",
      ],
      shownIndex: -1,
      ingredientArray: ["Protein", "Carbs", "Fat", "Fiber"],
    };
  },
  computed: {
    recipesPortions: {
      get() {
        return this.$store.state.searchAndAdd.recipesPortions;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setPortions", value);
      },
    },
    recipesName: { 
      get() {
        return this.$store.state.searchAndAdd.recipesName;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/nameRecipe", value);
      },
    },
    ...mapState("searchAndAdd", [
      "addedItemsRecipe",
      "recipes",
      "maintenanceCalories",
      "editIndex",
      "userID",
    ]),
    ...mapGetters("searchAndAdd", ["totalForRecipe"]),
    recipeProgress: {
      get() {
        let recipeProgress = null;
        if (this.recipesPortions) {
          recipeProgress =
            (this.totalForRecipe[0] /
              this.maintenanceCalories /
              this.recipesPortions) *
            100;
        } else {
          recipeProgress = 0;
        }
        return recipeProgress;
      },
      set(value) {},
    },
    isSame() {
      let name = this.recipesName == this.recipes[this.editIndex].NAME;
      let port = this.recipesPortions == this.recipes[this.editIndex].PORTIONS;
      let items =
        JSON.stringify(this.recipes[this.editIndex].INGREDIENTS) ==
        JSON.stringify(this.addedItemsRecipe);

      if (port && name && items) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "saveIngredients",
      "addDailyEntry",
      "addToRecipes",
      "setEditIndex",
      "removeRecipe",
    ]),
    validate() {
      this.$refs.form.validate();
    },
    updateRecipes() {
      const tokenPromise = new Promise((resolve, reject) => {
        firebase
          .auth()
          .currentUser.getIdToken(true)
          .then(function (token) {
            resolve(token);
          })
          .catch(function (error) {
            console.log(error);
          });
      });
      tokenPromise
        .then((token) => {
          this.$http.patch(`data/${this.userID}.json?auth=${token}`, {
            recipes: this.recipes,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submitNewRecipe() {
      if (this.valid) {
        this.addToRecipes({
          totalForRecipe: this.totalForRecipe,
          addedItemsRecipe: this.addedItemsRecipe,
          recipesName: this.recipesName,
          recipesPortions: this.recipesPortions,
        });
        this.setEditIndex(-1);
      }
    },
    submitChangedRecipe() {
      if (this.valid) {
        this.saveIngredients({
          editIndex: this.editIndex,
          totalForRecipe: this.totalForRecipe,
          addedItemsRecipe: this.addedItemsRecipe,
          recipesName: this.recipesName,
          recipesPortions: this.recipesPortions,
        });
        this.setEditIndex(-1);
      }
    },
  },
};
</script>

<style scoped>
.input {
  margin: 0 32px;
}
.totalText {
  width: 300px !important;
  margin: 0 !important;
}
.progressContainer {
  width: 170px;
}
@media only screen and (max-width: 1000px) {
  .v-progress-circular {
    width: 75px !important;
  }
  .progressContainer {
    width: 75px;
  }
  .totalText {
    width: 250px !important;
    margin: 0 !important;
  }
  .totalTextSize {
    font-size: 0.85rem !important;
    padding: 0 !important;
  }
  .buttonContainer {
    flex-direction: column;
  }
  .buttonContainer > .v-btn {
    margin-top: 0 !important;
  }
}
@media only screen and (max-width: 500px) {
  /* .progressCircle {
    display: none;
  } */
  .v-progress-circular {
    width: 60px !important;
  }
  .total {
    width: 200px !important;
    margin: 8px 0 0 0;
  }
  .totalText {
    font-size: 1.5rem !important;
    padding: 0 !important;
    width: 200px !important;
  }
  .totalAmountText {
    font-size: 1.25rem !important;
    padding: 0 !important;
  }
  .nutrient {
    margin: 0 0 0 0 !important;
  }
  .nutrientText {
    font-size: 0.9rem !important;
    padding: 0 !important;
  }
  .nutrientAmountText {
    font-size: 0.8rem !important;
    padding: 0 !important;
  }
  .buttonContainer > .v-btn {
    height: 40px;
    width: 40px;
  }
  .input {
    margin: 0 8px;
  }
}
</style>

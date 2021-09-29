<template>
  <v-dialog v-model="show" :fullscreen="fullscreen" style="height: 90vh">
    <v-card class="pa-3 d-flex flex-column dialog">
      <RecipeBox :nutrientArray="total" class="recipeBox">
        <v-btn
          class="totalButtons mt-2"
          icon
          x-large
          color="orange lighten-1"
          @click.stop="show = false"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </RecipeBox>
      <Search class="mx-auto mt-5" style="height: 64px; width: 80%" :recipesOpen="true"></Search>
      <RecipesEdit class="recipesEdit overflow-y-auto"></RecipesEdit>
    </v-card>

    <v-snackbar
      absolute
      centered
      rounded="pill"
      shaped 
      v-model="snackbar"
      :timeout="3000"
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import RecipeBox from "./RecipeBox";
import RecipesEdit from "./RecipesEdit";

import Search from "./Search";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  created() {
    this.handler();
    window.addEventListener("resize", this.handler);
  },
  destroyed() {
    window.removeEventListener("resize", this.handler);
  },
  mounted() {
    if (this.addedItemsRecipe.length == 0) {
      /* alert("Can't submit a recipe with no items, add some items!") */
      setTimeout(() => {
        this.snackbar = true;
      }, 500);
    }
  },
  data() {
    return {
      snackbar: false,
      text: `Can't submit a recipe with no items, add some items!`,
      fullscreen: false,
    };
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  components: {
    RecipeBox,
    RecipesEdit,
    Search,
  },
  computed: {
    ...mapState("searchAndAdd", [
      "addedItemsRecipe",
      "recipesPortions",
      "recipes",
      "userID",
      "editIndex",
      "queryRecipe",
    ]),
    ...mapGetters("searchAndAdd", ["totalForRecipe"]),
    
    total: {
      get() {
        let total = [0, 0, 0, 0, 0];
        if (this.recipesPortions) {
          for (let i = 0; i < 5; i++) {
            total[i] =
              Math.round(
                (this.totalForRecipe[i] / this.recipesPortions) * 100
              ) / 100;
          }
        }
        return total;
      },
    },
    show: {
      get() {
        return this.index != -1;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    ...mapActions("searchAndAdd", ["searchFood"]),
    handler(e) {
      if (window.innerWidth <= 500) {
        this.fullscreen = true;
      } else {
        this.fullscreen = false;
      }
    },
  },
};
</script>

<style scoped>
.v-card__actions {
  justify-content: space-around;
  padding: 15px;
}
.recipesEdit {
  height: calc(90vh - 240px - 64px - 2 * 12px - 20px);
}
.recipeBox {
  height: 240px;
}
@media only screen and (max-width: 1000px) {
  .totalButtons {
    margin-top: 0 !important;
  }
}
@media only screen and (max-width: 500px) {
  .dialog {
    padding: 8px !important;
  }
  .totalButtons {
    height: 40px;
    width: 40px;
  }
  .recipeBox {
    height: 220px;
  }
  .recipesEdit {
    height: calc(100vh - 220px - 64px - 3 * 12px);
  }
}
</style>
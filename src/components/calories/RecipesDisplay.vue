<template>
  <v-card
    class="grey lighten-3 rounded-lg pa-0"
    flat
    tile
    style="border: 2px solid black"
  >
    <div class="d-flex justify-space-between recipeTextBox">
      <v-card-text class="d-flex text-h4 textSize pa-0"
        >My Recipes:</v-card-text
      >
      <v-btn
        class="d-flex"
        color="cyan lighten-3"
        @click="
          setEditIndex(-2);
          startEdit(-2);
        "
      >
        <v-icon class="mr-2">mdi-plus-circle</v-icon>ADD NEW
      </v-btn>
    </div>
    <div class="overflow-y-auto d-flex flex-column recipeBox">
      <div
        v-for="(item, index) in recipes"
        :key="index"
        class="itemCard pa-2 pt-0"
      >
        <v-card
          draggable="true"
          @dragstart="dragStart(index)"
          outlined
          class="white itemBox"
        >
          <div class="d-flex mt-2">
            <div class="d-flex align-center ml-4">
              <v-btn
                icon
                large
                @click="
                  checkItemsIndex();
                  addPortionOfRecipe(index);
                  addItemTimeout(portionItem);
                "
              >
                <v-icon x-large>mdi-plus-circle</v-icon>
              </v-btn>
            </div>

            <div
              class="d-flex justify-center align-center textBox"
              :class="{ navbarActive: navbarActive }"
            >
              <v-card-text class="text-h5 pa-2 textWidth">{{
                item.NAME
              }}</v-card-text>
            </div>

            <div class="d-flex flex-column justify-center mr-2">
              <v-btn
                class="justify-end"
                large
                icon
                @click="
                  setAddedItemsRecipe(recipes[index].INGREDIENTS);
                  startEdit(index);
                "
              >
                <v-icon v-if="editIndex !== index" class="mr-2"
                  >mdi-pencil-outline</v-icon
                >
                <v-icon v-else class="mr-2">mdi-pencil-off-outline</v-icon>
              </v-btn>
              <v-btn
                class="justify-end"
                color="yellow"
                icon
                large
                @click="
                  setFavorite(index);
                  updateRecipes();
                "
              >
                <v-icon v-if="recipes[index].IS_FAVORITE == true" class="mr-2"
                  >mdi-star</v-icon
                >
                <v-icon v-else class="mr-2" color="black"
                  >mdi-star-outline</v-icon
                >
              </v-btn>
            </div>
          </div>
          <NutrientBox
            :nutrientArray="item.PORTION_NUTRIENTS"
            class="ma-2 totalTextSize grey lighten-3"
          ></NutrientBox>
        </v-card>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
</style>

<script>
import NutrientBox from "./NutrientBox";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    NutrientBox,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("searchAndAdd", [
      "recipes",
      "portionItem",
      "editIndex",
      "navbarActive",
      "userID",
    ]),
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "addPortionOfRecipe",
      "setEditIndex",
      "setFavorite",
      "addItemValue",
      "onRemoved",
      "checkItemsIndex",
      "dragAndDropItem",
    ]),
    ...mapActions("searchAndAdd", ["setAddedItemsRecipe"]),
    startEdit(index) {
      if (this.editIndex == index && this.editIndex != -2) {
        this.setEditIndex(-1);
      } else {
        this.setEditIndex(index);
        if (this.recipes[index]) {
          this.setAddedItemsRecipe(this.recipes[index].INGREDIENTS);
        } else {
          this.setAddedItemsRecipe([]);
        }
      }
    },
    addItemTimeout(portionItem) {
      setTimeout(() => {
        this.addItemValue(portionItem);
      }, 0);
    },
    addItemEntryTimeout(portionItem) {
      setTimeout(() => {
        this.addItemValueEntry(portionItem);
      }, 0);
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
    dragStart(index) {
      this.$emit("drag-start-recipe", true);
      this.dragAndDropItem({
        item: this.recipes[index],
        index,
      });
    },
  },
};
</script>

<style scoped>
.itemBox {
  width: 100%;
  border: solid #bfbfbf 1px !important;
  border-radius: 10px;
}
.textWidth {
  text-transform: capitalize;
  text-align: center;
}
.textBox {
  width: 246px;
  flex: 1;
}
.navbarActive {
  width: 217px !important;
}
.recipeTextBox {
  margin: 16px;
}
.recipeBox {
  height: calc(100% - 72px);
}
@media only screen and (max-width: 1350px) {
  .textSize {
    font-size: 22px !important;
  }
}

@media only screen and (max-width: 500px) {
  .recipeTextBox {
    margin: 12px;
  }
  .textSize {
    width: 150px;
  }
  .textWidth {
    text-transform: capitalize;
    text-align: center;
    font-size: 1.5rem !important;
  }
  .textBox {
    width: 160px;
  }
}
</style>
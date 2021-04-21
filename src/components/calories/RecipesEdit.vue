<template>
  <div flat tile class="grey lighten-3 rounded-lg" style="width: 100%">
    <div class="pl-2 d-flex flex-wrap flex-start" style="width: 100%">
      <div
        v-for="(item, index) in addedItemsRecipe"
        :key="index"
        class="itemCard pa-2 pb-0 pl-0"
      >
        <div
          class="rounded-lg clickbox pointer"
          @click="setActiveIndex(index)"
          v-ripple
        >
          <v-card style="width: 100%" outlined class="white itemBox">
            <div class="d-flex">
              <v-card-text
                style="
                  text-transform: capitalize;
                  text-align: center;
                  line-height: 100px;
                  height: 100px;
                "
                class="text-h5 pa-0 justify-end align-end flex-grow-1 textWidth"
                >{{ item.NAME }}</v-card-text
              >
              <div class="d-flex flex-column pt-2 pr-2" style="width: 125px">
                <div class="d-flex justify-end pr-0">
                  <v-btn class="justify-end" large icon>
                    <v-icon v-if="activeIndex != index" class="mr-2"
                      >mdi-pencil-outline</v-icon
                    >
                    <v-icon v-else class="mr-2">mdi-pencil-off-outline</v-icon>
                  </v-btn>
                  <v-btn
                    class="justify-end"
                    icon
                    large
                    color="red"
                    @click="onRemovedRecipe(index)"
                  >
                    <v-icon class="mr-2">mdi-delete</v-icon>
                  </v-btn>
                </div>
                <div style="height: 50px">
                  <v-card-text
                    v-if="activeIndex != index"
                    style="
                      padding-top: 10px;
                      font: inherit;
                      font-size: 16px;
                      text-align: right;
                      font-weight: 400;
                      letter-spacing: 0em;
                    "
                  >
                    <div v-if="item.IS_PORTION === false">
                      x {{ item.QUANTITY }}g
                    </div>
                    <div v-else>x {{ item.QUANTITY / 100 }} por.</div>
                  </v-card-text>
                  <div v-else class="d-flex justify-space-around">
                    <v-btn
                      class="mr-1"
                      icon
                      large
                      color="green"
                      @click="
                        onChangedRecipe({ item, quantity });
                        setDeleted(true);
                      "
                      :disabled="parseFloat(quantity) <= 0 || quantity === ''"
                    >
                      <v-icon>mdi-check-bold</v-icon>
                    </v-btn>
                    <v-text-field
                      class="mt-2 mr-1"
                      dense
                      ref="inputAmount"
                      type="number"
                      step="0.5"
                      v-model="quantity"
                      @keyup.enter="onChangedRecipe({ item, quantity })"
                    ></v-text-field>
                  </div>
                </div>
              </div>
            </div>
            <NutrientBox
              :nutrientArray="item.CALCULATED_NUTRIENTS"
              class="ma-2 mt-0"
            ></NutrientBox>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NutrientBox from "./NutrientBox.vue";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  components: {
    NutrientBox,
  },
  mounted() {
    window.addEventListener("mouseup", this.clickIndexHandler);
  },
  destroyed() {
    document.removeEventListener("mouseup", this.clickIndexHandler);
  },
  data() {
    return {};
  },
  watch: {
    activeIndex: {
      handler() {
        if (this.activeIndex != -1) {
          setTimeout(() => {
            if (this.$refs.inputAmount) {
              this.$refs.inputAmount[0].focus();
            }
          }, 0);
        }
      },
    },
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForRecipe"]),
    ...mapState("searchAndAdd", [
      "addedItemsRecipe",
      "dailyEntries",
      "entryTodayIndex",
    ]),
    quantity: {
      get() {
        return this.$store.state.searchAndAdd.quantity;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQuantity", value);
      },
    },
    activeIndex: {
      get() {
        return this.$store.state.searchAndAdd.activeIndex;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setActiveIndex", value);
      },
    },
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "onChangedRecipe",
      "onRemovedRecipe",
      "setActiveIndex",
      "setDeleted",
      "setMaintenanceCalories",
      "addDailyEntry",
    ]),
    clickIndexHandler(e) {
      if (this.activeIndex != -1) {
        if (
          document
            .getElementsByClassName("clickbox")
            [this.activeIndex].contains(e.target)
        ) {
        } else {
          this.onChangedRecipe({
            item: this.addedItemsRecipe[
              this.activeIndex
            ],
            quantity: this.quantity,
          });
          this.setActiveIndex(-1);
        }
      }
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
.borderRadius {
  border-radius: 20px;
}
.hover {
  background-color: #eeeeee;
  opacity: 0.8;
}
.textWidth {
  width: calc(100% - 125px);
}
.itemCard {
  width: calc(100% / 3) !important;
  user-select: none;
}
@media only screen and (min-width: 2500px) {
  .itemCard {
    width: 20% !important;
  }
}
@media only screen and (max-width: 1600px) {
  .itemCard {
    width: 50% !important;
  }
}
@media only screen and (max-width: 700px) {
  .itemCard {
    width: 100% !important;
  }
}
.pointer {
  cursor: pointer;
}
</style>
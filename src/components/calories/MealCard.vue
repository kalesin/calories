<template>
  <div
    flat
    tile
    class="grey lighten-3 d-flex flex-wrap rounded-lg"
    style="width: 100%"
  >
    <div
      v-for="(item, index) in items[itemsPropNames[itemsIndex]]"
      :key="index"
      class="itemCard pa-2 pb-0 pl-0"
    >
      <div
        class="rounded-lg clickbox pointer"
        @click="setActiveIndex(index)"
        v-ripple
      >
        <v-card
          outlined
          class="white itemBox"
          draggable="true"
          @dragstart="dragStart(index)"
        >
          <div class="d-flex">
            <div
              class="d-flex justify-center align-center textBox pl-2"
              :class="{ navbarActive: navbarActive }"
            >
              <v-card-text
                style
                class="text-h5 pa-0 justify-end align-end flex-grow-1 textWidth"
                >{{ item.NAME }}</v-card-text
              >
            </div>
            <div class="d-flex flex-column pt-2 pr-2 editBox">
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
                  @click="onRemoved(index)"
                >
                  <v-icon class="mr-2">mdi-delete</v-icon>
                </v-btn>
              </div>
              <div style="amountBox">
                <v-card-text v-if="activeIndex != index" class="textAmountBox">
                  <div v-if="item.IS_PORTION === false">
                    {{ item.QUANTITY }}g
                  </div>
                  <div v-else>{{ item.QUANTITY / 100 }} por.</div>
                </v-card-text>
                <div v-else class="d-flex justify-space-around inputBox">
                  <v-btn
                    class="mr-1 check"
                    icon
                    large
                    color="green"
                    @click="
                      onChanged({ item, quantity });
                      setDeleted(true);
                    "
                    :disabled="parseFloat(quantity) <= 0 || quantity === ''"
                  >
                    <v-icon>mdi-check-bold</v-icon>
                  </v-btn>
                  <v-text-field
                    class="mr-1 input"
                    dense
                    ref="inputAmount"
                    type="number"
                    step="0.5"
                    v-model="quantity"
                    @keyup.enter="onChanged({ item, quantity })"
                  ></v-text-field>
                </div>
              </div>
            </div>
          </div>
          <NutrientBox
            :nutrientArray="item.CALCULATED_NUTRIENTS"
            class="ma-2 mt-0 grey lighten-3"
          ></NutrientBox>
        </v-card>
      </div>
    </div>
  </div>
</template> 

<script>
import NutrientBox from "./NutrientBox";
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  mounted() {
    window.addEventListener("mouseup", this.clickIndexHandler);
  },
  destroyed() {
    document.removeEventListener("mouseup", this.clickIndexHandler);
  },
  components: {
    NutrientBox,
  },
  data() {
    return {
      choiceArray: ["Breakfast", "Lunch", "Dinner", "Snack"],
    };
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
    ...mapGetters("searchAndAdd", ["totalForToday", "today"]),
    ...mapState("searchAndAdd", [
      "addedItems",
      "items",
      "itemsPropNames",
      "itemsIndex",
      "dailyEntries",
      "navbarActive",
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
      "onChanged",
      "onRemoved",
      "dragAndDropItem",
      "setActiveIndex",
      "setDeleted",
    ]),
    dragStart(index) {
      this.$emit("drag-start", true);
      this.dragAndDropItem({
        item: this.items[this.itemsPropNames[this.itemsIndex]][index],
        index,
      });
    },
    clickIndexHandler(e) {
      if (this.activeIndex != -1) {
        if (
          !document
            .getElementsByClassName("clickbox")
            [this.activeIndex].contains(e.target)
        ) {
          this.onChanged({
            item: this.items[this.itemsPropNames[this.itemsIndex]][
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
.pointer {
  cursor: pointer;
}
.textBox {
  flex: 1;
}
.textWidth {
  text-transform: capitalize;
  text-align: center;
}
.editBox {
  width: 125px;
}
.amountBox {
  height: 50px;
}
.textAmountBox {
  padding-top: 10px;
  font: inherit;
  font-size: 16px;
  text-align: right;
  font-weight: 400;
  letter-spacing: 0em;
}
.input {
  margin-top: 6px;
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
@media only screen and (max-width: 1024px) {
  .itemCard {
    width: 100% !important;
  }
}
@media only screen and (max-width: 500px) {
  .textWidth {
    text-transform: capitalize;
    text-align: center;
  }
  .editBox {
    width: 90px;
    margin: 4px 16px 0 0 !important;
    padding: 0px !important;
  }
  .amountBox {
    height: 50px;
  }
  .textAmountBox {
    height: 44px;
    padding: 6px 0 0 16px;
    font: inherit;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0em;
  }
  .inputBox {
    height: 44px;
  }
  .input {
    margin: 0 0 0 8px !important;
    height: 44px;
  }
  .check {
    display: none;
  }
}
</style>
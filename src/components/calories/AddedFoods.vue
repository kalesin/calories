<template>
  <v-card
    flat
    tile
    class="grey lighten-3 d-flex rounded-lg pl-2 pt-2 flex-column"
  >
    <div
      v-for="(item, index) in choiceArray"
      :key="index"
      class="mb-2 d-flex flex-column"
    >
      <div
        class="
          d-flex
          justify-space-between
          rounded-lg
          normalColor
          dropZone
          choice
        "
        @click="setItemsIndex(index)"
        @dragenter="dragEnterClass(index)"
        @dragleave="dragLeaveClass(index)"
        @dragover.prevent
        @drop="onDrop({ dropIndex: index, dragIndex })"
        v-ripple
        :class="{
          activeColor: itemsIndex == index,
          hoverColor: hoverIndex === index,
        }"
      >
        <v-btn icon large class="mx-4 my-3 noEvents btn1">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
        <p class="text-h5 my-4 noEvents choiceText">{{ choiceArray[index] }}</p>
        <v-btn class="mx-4 my-3 noEvents btn2" icon large>
          <v-icon v-if="items[itemsPropNames[index]].length > 9"
            >mdi-numeric-9-plus-circle</v-icon
          >
          <v-icon v-else>{{
            `mdi-numeric-${items[itemsPropNames[index]].length}-circle`
          }}</v-icon>
        </v-btn>
      </div>
      <MealCard
        @drag-start="setRecipeDrag(false)"
        v-if="itemsIndex == index"
      ></MealCard>
    </div>
  </v-card>
</template>

<script>
import MealCard from "./MealCard";
import { mapGetters, mapState, mapActions } from "vuex";
import firebase from "firebase";

export default {
  mounted() {
    this.dragEndListener = document.addEventListener("dragend", (ev) => {
      this.hoverIndex = -1;
    });
  },
  destroyed() {
    if (this.dragEndListener) {
      document.removeEventListener("dragend", this.dragEndListener);
      this.dragEndListener = null;
    }
  },
  components: {
    MealCard,
  },
  data() {
    return {
      choiceArray: ["Breakfast", "Lunch", "Dinner", "Snack"],
      removedIndex: -1,
      hoverIndex: -1,
      activeIndex: -1,
    };
  },
  watch: {
    addedItems: {
      handler() {
        this.addDailyEntry();
        this.updateDailyEntries();
        this.setItems();
      },
      deep: true,
    },
    currentDate: {
      handler() {
        let index = this.dailyEntries.findIndex(
          (element) => element.date === this.currentDate
        );
        if (index == -1) {
          this.setAddedItems([]);
        } else {
          this.setAddedItems(this.dailyEntries[index].addedItems);
          this.setItems();
        }
      },
    },
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForToday", "today"]),
    ...mapState("searchAndAdd", [
      "addedItems",
      "itemsIndex",
      "items",
      "itemsPropNames",
      "dragIndex",
      "dailyEntries",
      "currentDate",
      "portionItem",
      "recipeDrag",
    ]),
    ...mapState("firebase", ["userID"]),
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "setItemsIndex",
      "setAddedItems",
      "addItem",
      "onRemoved",
      "setItems",
      "changeType",
      "addPortionOfRecipe",
      "addItemValue",
      "setRecipeDrag",
      "addDailyEntry",
    ]),
    updateDailyEntries() {
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
            dailyEntries: this.dailyEntries,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onDrop({ dropIndex, dragIndex }) {
      if (!this.recipeDrag) {
        if (this.itemsIndex != dropIndex) {
          this.onRemoved(dragIndex);
          this.setItemsIndex(dropIndex);
          this.changeType(dropIndex);
          this.addItem();
        }
      } else {
        if (this.itemsIndex != dropIndex) {
          this.setItemsIndex(dropIndex);
        }
        this.addPortionOfRecipe(dragIndex);
        this.addItemTimeout(this.portionItem);
      }
      this.hoverIndex = -1;
      this.activeIndex = dropIndex;
    },
    dragEnterClass(index) {
      this.hoverIndex = index;
      if (document.getElementsByClassName("activeColor")[index]) {
        this.removedIndex = index;
        this.activeIndex = -1;
      }
    },
    dragLeaveClass(index) {
      this.hoverIndex = -1;
    },
    addItemTimeout(portionItem) {
      setTimeout(() => {
        this.addItemValue(portionItem);
      }, 0);
    },
  },
};
</script>


<style scoped>
.normalColor {
  background-color: #26c6da;
}
.activeColor {
  background-color: #0097a7;
}
.hoverColor {
  background-color: orangered;
}
.noEvents {
  pointer-events: none;
}
.choice {
  width: 300px;
}
@media only screen and (max-width: 500px) {
  .choice {
    width: 200px;
  }
  .choiceText {
    font-size: 0.9rem !important;
    margin: 8px 0 !important;
  }
  .btn1 {
    margin: 2px 4px !important;
  }
  .btn2 {
    margin: 2px 4px !important;
  }
}
</style>
<template>
  <v-card outlined class="pa-0 rounded-lg dailyBox">
    <div class="d-flex my-auto">
      <div class="ma-auto" :class="{ progressCircle: !navbarActive }">
        <v-progress-circular
          :class="{
            navbarActive: navbarActive,
            cyan: metGoal == 0,
            lightGreen: metGoal == 1,
            orange: metGoal == 2,
          }"
          :size="100"
          :width="20"
          :rotate="90"
          :value="dailyProgress"
          >{{ Math.round(dailyProgress) }} %</v-progress-circular
        >
      </div>
      <div class="ma-auto my-auto total">
        <div class="ma-0 d-flex">
          <v-btn
            icon
            x-large
            color="cyan darken-1"
            class="buttonSize"
            @click="
              setCurrentDate(yesterday);
              dateToEdit(currentDate);
            "
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-card-text
            class="text-center text-h4 pa-0 pt-4 font-weight-bold totalText"
            >Total for {{ today }}:</v-card-text
          >
          <v-btn
            icon
            x-large
            color="cyan darken-1"
            class="buttonSize"
            @click="
              setCurrentDate(tomorrow);
              dateToEdit(currentDate);
            "
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <v-card-text class="text-center text-h4 pa-0 pt-2 totalAmountText"
          >{{ nutrientArray[0] }} kcal</v-card-text
        >
        <div class="d-flex justify-space-between mb-5 nutrient">
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
      <div
        class="d-flex flex-column ma-auto align-space-between justify-space-around"
      >
        <v-btn
          icon
          x-large
          color="cyan darken-1"
          @click="showDialogue = true"
          :disabled="isDisabled"
        >
          <v-icon>mdi-restore</v-icon>
        </v-btn>
        <ResetDialogue
          :visible="showDialogue"
          @close="showDialogue = false"
        ></ResetDialogue>
      </div>
    </div>
  </v-card>
</template>

<script>
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";

import ResetDialogue from "./ResetDialogue";

export default {
  components: { ResetDialogue },
  props: ["nutrientArray", "size", "type", "total"],
  data() {
    return {
      activeIndex: -1,
      showDialogue: false,
      ingredientArray: ["Protein", "Carbs", "Fat", "Fiber"],
      rules: [(v) => v.length <= 30 || "Max 30 characters"],
    };
  },
  computed: {
    isDisabled() {
      let disabled = false;
      if (this.addedItems.length == 0) {
        disabled = true;
      }
      return disabled;
    },
    ...mapState("searchAndAdd", [
      "addedItems",
      "items",
      "maintenanceCalories",
      "dailyEntries",
      "entryTodayIndex",
      "editIndex",
      "overwriteDailyEntry",
      "navbarActive",
      "currentDate",
    ]),
    ...mapGetters("searchAndAdd", ["totalForToday", "today"]),
    dailyProgress: {
      get() {
        return (this.totalForToday[0] / this.maintenanceCalories) * 100;
      },
      set(value) {},
    },
    metGoal() {
      if (this.dailyProgress < 90) {
        return 0;
      } else if (this.dailyProgress >= 90 && this.dailyProgress <= 110) {
        return 1;
      } else {
        return 2;
      }
    },
    tomorrow() {
      var today = dayjs(this.today).format("MMM DD, YYYY");
      var todayJS = new Date(today);
      var tomorrowJS = new Date(todayJS);
      tomorrowJS.setDate(todayJS.getDate() + 1);
      var tomorrow = dayjs(tomorrowJS).format("YYYY-MM-DD");
      return tomorrow;
    },
    yesterday() {
      var today = dayjs(this.today).format("MMM DD, YYYY");
      var todayJS = new Date(today);
      var yesterdayJS = new Date(todayJS);
      yesterdayJS.setDate(todayJS.getDate() - 1);
      var yesterday = dayjs(yesterdayJS).format("YYYY-MM-DD");
      return yesterday;
    },
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "addDailyEntry",
      "addToRecipes",
      "setCurrentDate",
      "resetDailyEntry",
    ]),
    dateToEdit(date) {
      this.$router.push("/calories?date=" + date);
    },
  },
};
</script>

<style scoped>
.cyan {
  color: #00acc1;
  background-color: white !important;
}
.lightGreen {
  color: #7cb342;
  background-color: white !important;
}
.orange {
  color: #fb8c00;
  background-color: white !important;
}
.dailyBox {
  height: 190px;
}
.navbarActive {
  width: 50px !important;
}
.buttonSize {
  margin-top: 12px;
}
@media only screen and (max-width: 1024px) {
  .v-progress-circular {
    width: 70px !important;
  }
  .total {
    width: 250px;
  }
  .totalText {
    font-size: 1.5rem !important;
    padding: 0 !important;
  }
  .totalAmountText {
    font-size: 1.4rem !important;
    padding: 0 !important;
  }
  .nutrient {
    margin: 0 0 0 0 !important;
  }
  .nutrientText {
    font-size: 0.9rem !important;
    padding: 0 !important;
  }
  .amountTextSize {
    font-size: 0.85rem !important;
    padding: 0 !important;
  }
  .totalButtons {
    width: 40px !important;
  }
}

@media only screen and (max-width: 850px) {
  .total {
    margin: auto;
  }
  .totalText {
    width: 200px;
    font-size: 1.5rem !important;
    padding: 0 !important;
  }
}
@media only screen and (max-width: 800px) {
  .progressCircle {
    display: none;
  }
  .total {
    width: 190px !important;
    margin: auto;
  }
  .v-progress-circular {
    width: 60px !important;
  }
  .totalText {
    font-size: 1.2rem !important;
    padding: 0 !important;
  }
  .nutrient {
    margin-left: 10px !important;
    width: 90%;
  }
  .buttonSize {
    width: 40px;
    height: 40px;
    margin-top: 20px;
  }
}
</style>

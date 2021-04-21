<template>
  <v-card
    flat
    outlined
    class="pa-0 rounded-lg d-flex flex-column grey lighten-3"
  >
    <v-card-text class="text-center text-h4 pa-2 totalText"
      >{{ nutrientArray[0] }} kcal</v-card-text
    >
    <div class="d-flex justify-space-between mx-4 nutrient">
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
  </v-card>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  props: ["nutrientArray"],
  data() {
    return {
      ingredientArray: ["Protein", "Carbs", "Fat", "Fiber"],
    };
  },
  computed: {
    ...mapState("searchAndAdd", [
      "addedItems",
      "maintenanceCalories",
      "dailyEntries",
      "entryTodayIndex",
      "editIndex", 
      "recipes",
    ]),
    ...mapGetters("searchAndAdd", ["totalForToday"]),
  },
  methods: {
    ...mapActions("searchAndAdd", ["addDailyEntry", "addToRecipes"]),
  },
};
</script>

<style scoped>
.totalText {
  font-size: 2rem;
}
@media only screen and (max-width: 500px) {
  .totalText {
    font-size: 1.35rem !important;
    padding: 0 !important;
  }
  .nutrient {
  }
  .nutrientText {
    font-size: 0.9rem !important;
    padding: 0 !important;
  }
  .nutrientAmountText {
    font-size: 0.8rem !important;
    padding: 0 !important;
  }
  .totalButtons {
    width: 40px !important;
  }
}
</style>

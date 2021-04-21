<template>
  <div>
    <CalendarMonth class="calendar"></CalendarMonth>
  </div>
</template>

<script>
import CalendarMonth from "./CalendarMonth";

import { mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "Calendar",

  components: {
    CalendarMonth,
  },

  data() {
    return {
      dateClicked: "",
    };
  },

  computed: {
    ...mapState("searchAndAdd", [
      "dailyEntries",
      "maintenanceCalories",
      "daysUnix",
    ]),
    ...mapGetters("searchAndAdd", ["compareCalendar"]),
  },

  methods: {
    ...mapActions("firebase", ["getData"]),
  },
};
</script>

<style scoped>
.calendar {
  height: 100vh !important;
}
@media only screen and (max-width: 500px) {
  .calendar {
    height: calc((100vh - 2 * 12px) / 2);
  }
}
</style>

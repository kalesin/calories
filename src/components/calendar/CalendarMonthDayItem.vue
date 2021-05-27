<template>
  <li
    class="calendar-day"
    :class="{
      'calendar-day--not-current': !day.isCurrentMonth,
      'calendar-day--today': isToday,
      'calendar-day--current': isCurrent,
      'calendar-day--28': days.length <=28,
      'calendar-day--35': days.length <= 35 && days.length > 28,
      'calendar-day--42': days.length >35
    }"
    @click="selectDate(day)"
  >
    <span class="ma-1">{{ label }}</span>
    <div
      v-if="day.entry"
      class="d-flex justify-space-around"
      style="width: 100%"
    >
      <v-progress-linear
        v-if="metGoal == 0"
        striped
        color="cyan darken-1"
        v-model="dailyProgress"
        class="progress"
      >
        <strong class="progressText">{{ Math.round(dailyProgress) }} %</strong>
      </v-progress-linear>
      <v-progress-linear
        v-if="metGoal == 1"
        striped
        color="light-green darken-1"
        v-model="dailyProgress"
        class="progress"
      >
        <strong class="progressText">{{ Math.round(dailyProgress) }} %</strong>
      </v-progress-linear>
      <v-progress-linear
        v-if="metGoal == 2"
        striped
        color="deep-orange accent-4"
        v-model="dailyProgress"
        class="progress"
      >
        <strong class="progressText">{{ Math.round(dailyProgress) }} %</strong>
      </v-progress-linear>
    </div>
  </li>
</template>

<script>
import dayjs from "dayjs";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  name: "CalendarMonthDayItem",
  data() {
    return {
      hide: false,
    };
  },
  props: {
    day: {
      type: Object,
      required: true,
    },

    isCurrentMonth: {
      type: Boolean,
      default: false,
    },

    isToday: {
      type: Boolean,
      default: false,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    days: {
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapState("searchAndAdd", ["dailyEntries", "maintenanceCalories"]),
    label() {
      return dayjs(this.day.date).format("D");
    },
    dailyProgress: {
      get() {
        return (this.day.entry.total[0] / this.maintenanceCalories) * 100;
      },
      set(value) {},
    },
    metGoal() {
      if (this.dailyProgress <= 90) {
        return 0;
      } else if (this.dailyProgress > 90 && this.dailyProgress < 110) {
        return 1;
      } else {
        return 2;
      }
    },
  },
  methods: {
    ...mapActions("searchAndAdd", ["setEditDate"]),
    selectDate(day) {
      this.setEditDate(day.date);
      this.$emit("selectDate");
    },
    myEventHandler(e) {
      if (window.innerWidth <= 1600) {
        this.hide = true;
      } else {
        this.hide = false;
      }
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
.progress {
  height: 100% !important;
  font-size: 1.5rem;
}
@media only screen and (max-width: 1600px) {
  .v-progress-circular {
    width: 100%;
    margin: auto;
  }
}
@media only screen and (max-width: 1000px) {
  .textBox {
    display: none !important;
  }
}
@media only screen and (max-width: 500px) {
  .progress {
    font-size: 0.8rem;
  }
  .progressText {
    display: none;
  }
}

.v-progress-circular {
  margin: auto;
  margin-right: 12px;
  width: 100%;
}
.middiv {
  position: absolute;
  height: 30px;
  bottom: 0;
  z-index: 0;
  width: 100%;
  height: 75%;
  display: flex;
}
.btn {
  height: 25%;
  width: 70%;
  position: absolute;
  top: 0;
  font-size: 10px;
  left: 20px;
}
.button-progressbar {
  z-index: 2;
  align-self: center;
  width: 100%;
}
span {
  z-index: 1;
}

.calendar-day {
  display: flex;
  position: relative;
  font-size: 16px;
  background-color: #fff;
  color: var(--grey-800);
  padding: 0 0;
}
.calendar-day--28{
  height: calc((100vh - 100px - 2 * 12px - 4px) / 4);
}
.calendar-day--35{
  height: calc((100vh - 100px - 2 * 12px - 5px) / 5);
}
.calendar-day--42{
  height: calc((100vh - 100px - 2 * 12px - 6px) / 6);
}

.calendar-day > span {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 2px;
  width: var(--day-label-size);
  height: var(--day-label-size);
}

.calendar-day--not-current {
  background-color: var(--grey-100);
  color: var(--grey-300);
}

.calendar-day--today {
  font-size: 20px;
  font-weight: 900;
  border: 3px solid orangered;
}
.calendar-day--current {
  font-size: 20px;
  font-weight: 900;
  border: 3px solid black;
}
@media only screen and (max-width: 500px) {
  .calendar-day--today {
  border: 2px solid orangered;
}
.calendar-day--current {
  border: 2px solid black;
}
}
</style>

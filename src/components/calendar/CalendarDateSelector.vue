<template>
  <div class="calendar-date-selector">
    <div class="previous-next" @click="selectPrevious">{{previous}}</div>
    <div class="current" @click="selectCurrent">{{ selectedMonth }}</div>
    <div class="previous-next" @click="selectNext">></div>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "CalendarModeSelector",
  data() {
    return {
      previous: "<"
    };
  },

  props: {
    currentDate: {
      type: String,
      required: true
    },

    selectedDate: {
      type: Object,
      required: true
    }
  },

  methods: {
    selectPrevious() {
      let newSelectedDate = dayjs(this.selectedDate).subtract(1, "month");
      this.$emit("dateSelected", newSelectedDate);
    },

    selectCurrent() {
      let newSelectedDate = dayjs(this.currentDate);
      this.$emit("dateSelected", newSelectedDate);
    },

    selectNext() {
      let newSelectedDate = dayjs(this.selectedDate).add(1, "month");
      this.$emit("dateSelected", newSelectedDate);
    }
  },
  computed: {
    selectedMonth() {
      return this.selectedDate.format("MMMM YYYY");
    }
  }
};
</script>

<style scoped>
@media only screen and (max-width: 500px) {
  .current {
    font-size: 1.25rem !important;
  }
}
.previous-next {
  width: 25%;
}

.current {
  width: 50%;
}
.calendar-date-selector {
  display: flex;
  justify-content: space-around;
  width: 100%;
  color: var(--grey-800);
  font-size: 20px;
  font-weight: 900;
}

.calendar-date-selector > * {
  cursor: pointer;
  user-select: none;
}
</style>

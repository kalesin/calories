<template>
  <ol class="day-of-week">
    <li v-for="weekday in weekdays" :key="weekday">{{ weekday }}</li>
  </ol>
</template>

<script>
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default {
  name: "CalendarWeekdays",

  computed: {
    weekdays() {
      return WEEKDAYS;
    }
  }
};
</script>

<style scoped>

.day-of-week {
  height: 50px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-of-week > * {
  margin-top: 10px;
  text-align: center;
}
</style>

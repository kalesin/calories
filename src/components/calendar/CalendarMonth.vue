<template>
  <div>
    <div class="calendar-month">
      <div class="calendar-month-header">
        <CalendarDateSelector
          :current-date="today"
          :selected-date="selectedDate"
          @dateSelected="selectDate"
        />
      </div>

      <CalendarWeekdays />

      <ol class="days-grid">
        <CalendarMonthDayItem
        :days="days"
          v-for="day in compareCalendarToEntries"
          :key="day.date"
          :day="day"
          :is-today="day.date === todayDate"
          :is-current="day.date == today"
          @selectDate="dateToEdit(day)"
        />
      </ol>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import CalendarMonthDayItem from "./CalendarMonthDayItem";
import CalendarDateSelector from "./CalendarDateSelector";
import CalendarWeekdays from "./CalendarWeekdays";
import { mapGetters, mapState, mapActions } from "vuex";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export default {
  name: "CalendarMonth",
  components: {
    CalendarMonthDayItem,
    CalendarDateSelector,
    CalendarWeekdays,
  },

  data() {
    return {
      selectedDate: dayjs(),
      dateClicked: "",
      message: "",
    };
  },
  watch: {
    entryEditIndex: {
      handler() {
        this.compareCalendarToEntries;
      },
    },
  },

  computed: {
    ...mapState("searchAndAdd", [
      "dailyEntries",
      "dailyEntryTemp",
      "maintenanceCalories",
      "entryEditIndex",
      "editEntries",
      "daysUnix",
    ]),
    ...mapGetters("searchAndAdd", ["compareCalendar", "today"]),
    days() {
      return [
        ...this.previousMonthDays,
        ...this.currentMonthDays,
        ...this.nextMonthDays,
      ];
    },
    daysInUnix() {
      let unix = JSON.parse(JSON.stringify(this.days));
      for (let i = 0; i < unix.length; i++) {
        unix[i].dateUnix =
          new Date(unix[i].date.split("-").join(".")).getTime() / 1000;
      }
      this.setDaysUnix(unix);
      return unix;
    },
    compareCalendarToEntries() {
      let same = this.daysInUnix;
      for (let i = 0; i < this.days.length; i++) {
        for (let j = 0; j < this.dailyEntries.length; j++) {
          if (this.days[i].date === this.dailyEntries[j].date) {
            same[i] = {
              ...same[i],
              entry: this.dailyEntries[j],
            };
          }
        }
      }
      return same;
    },
    todayDate() {
      return dayjs().format("YYYY-MM-DD");
    },
    month() {
      return Number(this.selectedDate.format("M"));
    },

    year() {
      return Number(this.selectedDate.format("YYYY"));
    },

    numberOfDaysInMonth() {
      return dayjs(this.selectedDate).daysInMonth();
    },

    currentMonthDays() {
      return [...Array(this.numberOfDaysInMonth)].map((day, index) => {
        return {
          date: dayjs(`${this.year}-${this.month}-${index + 1}`).format(
            "YYYY-MM-DD"
          ),
          isCurrentMonth: true,
        };
      });
    },

    previousMonthDays() {
      const firstDayOfTheMonthWeekday = this.getWeekday(
        this.currentMonthDays[0].date
      );
      const previousMonth = dayjs(`${this.year}-${this.month}-01`).subtract(
        1,
        "month"
      );

      // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
      const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
        ? firstDayOfTheMonthWeekday - 1
        : 6;

      const previousMonthLastMondayDayOfMonth = dayjs(
        this.currentMonthDays[0].date
      )
        .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
        .date();

      return [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
        (day, index) => {
          return {
            date: dayjs(
              `${previousMonth.year()}-${previousMonth.month() + 1}-${
                previousMonthLastMondayDayOfMonth + index
              }`
            ).format("YYYY-MM-DD"),
            isCurrentMonth: false,
          };
        }
      );
    },

    nextMonthDays() {
      const lastDayOfTheMonthWeekday = this.getWeekday(
        `${this.year}-${this.month}-${this.currentMonthDays.length}`
      );

      const nextMonth = dayjs(`${this.year}-${this.month}-01`).add(1, "month");

      const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
        ? 7 - lastDayOfTheMonthWeekday
        : lastDayOfTheMonthWeekday;

      return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
        return {
          date: dayjs(
            `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
          ).format("YYYY-MM-DD"),
          isCurrentMonth: false,
        };
      });
    },
  },

  methods: {
    ...mapActions("firebase", ["getData"]),
    ...mapActions("searchAndAdd", [
      "setDaysUnix",
      "setEditDate",
      "setItems",
      "setCurrentDate",
    ]),
    getWeekday(date) {
      return dayjs(date).weekday();
    },
    selectDate(newSelectedDate) {
      this.selectedDate = newSelectedDate;
    },
    dateToEdit(day) {
      this.$router.push("/calories?date=" + day.date);
    },
  },
};
</script>

<style scoped>
.calendar-month {
  position: relative;
  background-color: var(--grey-200);
  border: solid 1px var(--grey-300);

  font-weight: 100;

  --grey-100: #e4e9f0;
  --grey-200: #cfd7e3;
  --grey-300: #b5c0cd;
  --grey-800: #3e4e63;
  --grid-gap: 1px;
  --day-label-size: 20px;

  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.day-of-week {
  color: var(--grey-800);
  font-size: 18px;
  background-color: #fff;
  padding-bottom: 5px;
  padding-top: 10px;
}

.day-of-week,
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-of-week > * {
  text-align: right;
  padding-right: 5px;
}

.days-grid {
  height: calc(100vh - 100px - 2 * 12px);
  position: relative;
  grid-column-gap: var(--grid-gap);
  grid-row-gap: var(--grid-gap);
  border-top: solid 1px var(--grey-200);
}

.calendar-month-header {
  height: 50px;
  display: flex;
  justify-content: center;
  background-color: #fff;
  padding: 10px;
}

ol,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>

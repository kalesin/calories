<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-text class="pa-3 text-h4 text-center"
        >Want to delete this day's entry?</v-card-text
      >
      <v-card-actions class="pa-4 pt-0">
        <v-btn
          color="success"
          @click.stop="
            resetDailyEntry();
            show = false;
          "
          >Yes, Confirm</v-btn
        >
        <v-btn color="error" @click.stop="show = false">No, Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

import dayjs from "dayjs";

export default {
  props: ["visible"],
  computed: {
    ...mapState("searchAndAdd", ["addedItems", "items"]),
    ...mapGetters("searchAndAdd", ["totalForToday", "today"]),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    ...mapActions("searchAndAdd", ["resetDailyEntry"]),
  },
};
</script>

<style scoped>
.v-card__actions {
  justify-content: space-around;
  padding: 15px;
}
</style>
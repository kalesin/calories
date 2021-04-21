<template>
  <v-dialog v-model="show" max-width="500px" max-height="100px" height="200px">
    <v-card class="py-4">
      <v-card-text class="text-h4 text-center" v-if="!entry"
      >Clicking will permanently delete the selected recipe. Want to delete recipe?</v-card-text>
      <v-card-text class="text-h4 text-center" v-else
      >Clicking will permanently delete the selected day's entry. Want to delete entry?</v-card-text>

      <v-card-actions class="pa-2 pt-0">
        <v-btn
        v-if="!entry"
          color="success"
          @click.stop=" 
      removeRecipe({index: deleteIndex})
      show=false
      "
        >Yes, Delete</v-btn>
        <v-btn
        v-else
          color="success"
          @click.stop=" 
      deleteEntry()
      show=false
      "
        >Yes, Delete</v-btn>
        <v-btn color="error" @click.stop="show=false">No, Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  props: {
  	index: {
      type: Number,
      required: true
    },
    entry: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForToday"]),
    ...mapState("searchAndAdd", ["deleteIndex"]),
    show: {
      get() {
        return this.index >= 0
      },
      set(value) {
        if (!value) {
          this.$emit("close")
        }
      }
    }
  },
  methods: {
    ...mapActions("searchAndAdd", ["removeRecipe", "deleteEntry"]),
  }
};
</script>

<style scoped>
.v-card__actions {
  justify-content: space-around;
  padding: 15px;
}
</style>
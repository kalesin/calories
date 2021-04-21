<template>
  <v-card flat class="d-flex flex-column">
    <div v-if="editIndex==-1">
      <v-text-field
        dense
        clearable
        placeholder="Search for food you want to add!"
        ref="search"
        solo
        v-model="query"
        @keyup.enter="
        checkItemsIndex()
                searchFood({query: query, searchRecipe: false});
                "
      ></v-text-field>
    </div>
    <div v-if="editIndex!=-1">
      <v-text-field
        dense
        clearable
        placeholder="Search for food you want to add!"
        ref="search"
        solo
        v-model="queryRecipe"
        @keyup.enter="
                searchFood({query: queryRecipe, searchRecipe: true});
                "
      ></v-text-field>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  mounted() {
    this.$refs.search.focus();
  },
  computed: {
    ...mapState("searchAndAdd", ["addedItems", "itemsPropNames", "items", "editIndex"]),
    query: {
      get() {
        return this.$store.state.searchAndAdd.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQuery", value);
      }
    },
    queryRecipe: {
      get() {
        return this.$store.state.searchAndAdd.queryRecipe;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQueryRecipe", value);
      }
    },
  },
  methods: {
    ...mapActions("searchAndAdd", ["searchFood", "checkItemsIndex"]),
  }
};
</script>

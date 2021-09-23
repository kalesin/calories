<template>
  <v-card flat class="d-flex flex-column">
    <div v-if="editIndex == -1">
      <div class="d-flex">
        <v-text-field
          dense
          clearable
          placeholder="Search for food you want to add!"
          ref="search"
          solo
          v-model="query"
          @keyup.enter="
            setResponseData([]);
            resetSearchResults();
            searchFood({ query: query, searchRecipe: false });
          "
          @click:clear="
            setResponseData([]);
            resetSearchResults();
          "
        ></v-text-field>
        <v-btn
          :class="{ 'yellow lighten-3': expandable }"
          class="ml-3"
          @click="expandSearchResults()"
        >
          <b>{{ page }}...</b>
        </v-btn>
        <v-btn
          class="ml-3"
          icon
          large
          color="orange"
          style="height: 36px; width: 36px"
          @click="
            setResponseData([]);
            resetSearchResults();
          "
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </div>
      <v-expansion-panels
        accordion
        class="mt-n5"
        v-if="response"
        v-model="panel"
      >
        <v-expansion-panel
          v-for="(item, i) in responseData.slice(start, end)"
          :key="i"
        >
          <div class="d-flex flex-row">
            <v-btn
              class="ma-2"
              color="yellow"
              icon
              large
              @click="
                setFavoriteSearchResults(item.id);
                updateFavoriteResults();
              "
            >
              <v-icon v-if="favorite(item.id) > -1" class="ma-2"
                >mdi-star</v-icon
              >
              <v-icon v-else class="ma-2" color="black"
                >mdi-star-outline</v-icon
              >
            </v-btn>
            <v-expansion-panel-header
              @mouseenter="setPanel(i)"
              @mouseleave="resetTimer"
              @click="
                checkItemsIndex();
                selectFood({ choiceIndex: i, searchRecipe: false });
                resetSearchResults();
                updateRecentResults();
              "
              class="text-h6 text-left font-weight-regular pl-0"
              style="display: inline-block; width: 75%"
              >{{ item.name }}</v-expansion-panel-header
            >
            <v-card-text
              class="text-subtitle-1 text-left pa-4 text-justify-center"
              style="width: 20%; height: 64px"
              v-if="recentSearchResultsID.includes(item.id)"
            >
              <v-icon class="mr-2 large">mdi-clock-time-eight-outline</v-icon
              >{{ `${timeToNow(item.id)} ago` }}
            </v-card-text>
          </div>

          <v-expansion-panel-content>
            <NutrientBox
              :nutrientArray="item.nutrientArray"
              class="my-0 mx-auto gray lighten-4 listBox"
            ></NutrientBox>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-if="editIndex != -1">
      <v-text-field
        dense
        clearable
        placeholder="Search for food you want to add!"
        ref="search"
        solo
        v-model="queryRecipe"
        @keyup.enter="searchFood({ query: queryRecipe, searchRecipe: true })"
      ></v-text-field>
    </div>
  </v-card>
</template>

<script>
import NutrientBox from "./NutrientBox";
import { mapActions, mapGetters, mapState } from "vuex";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default {
  watch: {
    end: {
      deep: true,
      handler() {
        this.setPage(this.end / 5);
        if (this.responseData.length - this.end < 0) {
          this.setExpandable(false);
        }
      },
    },
    responseData: {
      deep: true,
      handler() {
        this.setExpandable(true);
      },
    },
  },
  components: {
    NutrientBox,
  },
  mounted() {
    this.$refs.search.focus();
  },
  data() {
    return {
      panel: null,
      timer: null,
      start: 0,
      end: 5,
      expandable: false,
      page: 1,
    };
  },
  computed: {
    ...mapState("searchAndAdd", [
      "addedItems",
      "itemsPropNames",
      "items",
      "editIndex",
      "responseData",
      "response",
      "favoriteSearchResults",
      "recentSearchResults",
      "recentSearchResultsID",
      "resultsArray",
    ]),
    ...mapState("firebase", ["userID"]),
    query: {
      get() {
        return this.$store.state.searchAndAdd.query;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQuery", value);
      },
    },
    queryRecipe: {
      get() {
        return this.$store.state.searchAndAdd.queryRecipe;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setQueryRecipe", value);
      },
    },
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "searchFood",
      "checkItemsIndex",
      "selectFood",
      "setResponseData",
      "setFavoriteSearchResults",
    ]),
    timeToNow(value) {
      let array = [];
      for (let i = 0; i < this.recentSearchResults.length; i++) {
        array.push(this.recentSearchResults[i].id);
      }
      let index = array.indexOf(value);
      return dayjs(this.recentSearchResults[index].time).toNow(true);
    },
    updateFavoriteResults() {
      this.$http.patch("data/" + `${this.userID}` + ".json", {
        favoriteSearchResults: this.favoriteSearchResults,
      });
    },
    updateRecentResults() {
      this.$http.patch("data/" + `${this.userID}` + ".json", {
        recentSearchResults: this.recentSearchResults,
      });
    },
    favorite(value) {
      return this.favoriteSearchResults.findIndex((el) => el == value);
    },
    setPanel(index) {
      this.timer = setTimeout(() => (this.panel = parseInt(index)), 100);
    },
    resetTimer() {
      clearTimeout(this.timer);
    },
    expandSearchResults() {
      if (this.end < this.responseData.length) {
        this.start = this.end;
        this.end += 5;
      } else {
        this.resetSearchResults();
      }
    },
    resetSearchResults() {
      this.start = 0;
      this.end = 5;
    },
    setExpandable(value) {
      this.expandable = value;
    },
    setPage(value) {
      this.page = value;
    },
  },
};
</script>

<style scoped>
.listBox {
  width: 50%;
}
.expandable {
  background-color: yellow !important;
}
</style>

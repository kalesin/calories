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
            searchFood({ query: query, searchRecipe: false });
          "
          @click:clear="setResponseData([])"
        ></v-text-field>
      </div>
      <v-expansion-panels
        accordion
        class="mt-n5"
        v-if="responseData.length != 0"
        v-model="panel"
        style="position: relative; z-index: 2"
      >
        <v-expansion-panel
          v-for="(item, i) in responseData.slice((page - 1) * 5, page * 5)"
          :key="i"
          style="width: 100%"
        >
          <div
            @mouseenter="setPanel(i)"
            @mouseleave="
              setPanel(null);
              resetTimer;
            "
            class="d-flex flex-row"
          >
            <v-btn
              class="ma-2"
              color="yellow"
              style="width: 5%"
              icon
              large
              @click="
                setFavoriteSearchResults(item.id);
                updateRecentAndFavoriteResults();
              "
            >
              <v-icon v-if="favorite(item.id) > -1" class="ma-2"
                >mdi-star</v-icon
              >
              <v-icon v-else class="ma-2" color="black"
                >mdi-star-outline</v-icon
              >
            </v-btn>
            <div
              style="width: 95%"
              class="d-flex flex-row"
              @click="
                checkItemsIndex();
                selectFood({
                  choiceIndex: i + (page - 1) * 5,
                  searchRecipe: false,
                });
                setResponseData([]);
                updateRecentAndFavoriteResults();
              "
            >
              <v-expansion-panel-header
                class="text-h6 text-left font-weight-regular pl-0"
                style="display: inline-block; width: 75%"
                >{{ item.name }}</v-expansion-panel-header
              >
              <v-card-text
                class="text-subtitle-1 text-left pa-4 text-justify-center"
                style="width: 25%; height: 64px"
                v-if="item.lastAdded && !item.favorite"
              >
                <v-icon class="mr-2 large">mdi-clock-time-eight-outline</v-icon
                >{{ `${timeToNow(item.lastAdded)} ago` }}
              </v-card-text>
            </div>
          </div>
          <transition name="expand" v-if="panel == i">
            <v-expansion-panel-content
              style="position: absolute; width: 100%; z-index: 4"
            >
              <NutrientBox
                :nutrientArray="item.nutrientArray"
                class="my-0 mx-auto listBox"
              ></NutrientBox>
            </v-expansion-panel-content>
          </transition>
        </v-expansion-panel>
        <v-card style="width: 100%"
          ><v-pagination
            :total-visible="7"
            v-model="page"
            class="my-4"
            :length="Math.round(responseData.length / 5)"
          ></v-pagination
        ></v-card>
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
import firebase from 'firebase'
import NutrientBox from "./NutrientBox";
import { mapActions, mapGetters, mapState } from "vuex";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default {
  watch: {
    page: {
      deep: true,
      handler() {
        this.panel = null;
      },
    },
  },
  components: {
    NutrientBox,
  },
  created() {
    window.addEventListener("click", this.onClickOutside);
  },
  destroyed() {
    window.removeEventListener("click", this.onClickOutside);
  },
  mounted() {
    this.$refs.search.focus();
  },
  data() {
    return {
      panel: null,
      timer: null,
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
      return dayjs(value).toNow(true);
    },
    updateRecentAndFavoriteResults() {
      const tokenPromise = new Promise((resolve, reject) => {
        firebase
          .auth()
          .currentUser.getIdToken(true)
          .then(function (token) {
            resolve(token);
          })
          .catch(function (error) {
            console.log(error);
          });
      });
      tokenPromise
        .then((token) => {
          this.$http.patch(`data/${this.userID}.json?auth=${token}`, {
        favoriteSearchResults: this.favoriteSearchResults,
        recentSearchResults: this.recentSearchResults,
      });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    favorite(value) {
      return this.favoriteSearchResults.findIndex((el) => el == value);
    },
    setPanel(index) {
      this.panel = index; /* 
      this.timer = setTimeout(() => (this.panel = parseInt(index)), 100); */
    },
    resetTimer() {
      clearTimeout(this.timer);
    },
    setPage(value) {
      this.page = value;
    },
    onClickOutside(e) {
      let parentNode = document.getElementsByClassName("v-expansion-panels")[0];
      if (parentNode && !parentNode.contains(e.target)) {
        this.setResponseData([]);
        this.setPage(1);
      }
    },
  },
};
</script>

<style scoped>
.listBox {
  margin-left: 0 !important;
  width: 50%;
  border: 1px solid #cccccc;
  background-color: #eeeeee !important;
}
.expand-enter,
.expand-leave-to {
  opacity: 0;
  transform: rotateY(45deg);
}
.expand-enter-to,
.expand-leave {
  opacity: 1;
  transform: rotateY(0deg);
}
.expand-enter-active,
.expand-leave-active {
  transition: opacity, transform 150ms ease-out;
}
.disabled {
  pointer-events: none;
}
</style>

<style >
.v-expansion-panel-content__wrap {
  padding: 52px !important;
  padding-top: 0 !important;
}
</style>

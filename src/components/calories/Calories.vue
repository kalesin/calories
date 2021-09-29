<template>
  <v-container fluid class="ma-0 d-flex container">
    <div class="d-flex flex-column middle">
      <Search class="mx-auto search" :recipesOpen="false"></Search>
      <DailyBox class="dailyBox mb-3" :nutrientArray="totalForToday"></DailyBox>
      <AddedFoods class="addedFoods overflow-y-auto"></AddedFoods>
    </div>
    <RecipesDisplay
      @drag-start-recipe="setRecipeDrag(true)"
      class="ml-3 display"
      @close="activeIndex = -1"
    ></RecipesDisplay>

    <Recipes
      v-if="editIndex != -1"
      @close="
        editIndex = -1;
        setResponseData([]);
      "
      :index="editIndex"
    ></Recipes>
  </v-container>
</template>

<style scoped>
</style>

<script>
import AddedFoods from "./AddedFoods";
import RecipesDisplay from "./RecipesDisplay";
import DailyBox from "./DailyBox";
import Search from "./Search";

import Recipes from "./Recipes";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  beforeRouteLeave(to, from, next) {
    this.addDailyEntry();
    next();
  },
  data() {
    return {
      hide: false,
      entryExists: null,
    };
  },
  components: {
    AddedFoods,
    RecipesDisplay,
    DailyBox,
    Search,
    Recipes,
  },
  watch: {
    editIndex: {
      handler() {
        if (this.editIndex != -1 && this.editIndex != -2) {
          this.recipesName = this.recipes[this.editIndex].NAME;
          this.recipesPortions = this.recipes[this.editIndex].PORTIONS;
        } else if (this.editIndex != -1 && this.editIndex == -2) {
          this.recipesName = "New Recipe";
          this.recipesPortions = 1;
        }
      },
    },
  },
  created() {
    let date = null;
    let query = this.$router.currentRoute.query.date;
    if (query) {
      this.setCurrentDate(query);
      date = query;
    } else {
      this.setCurrentDate(this.today);
      this.$router.push("calories?date=" + this.today);
    }
    let index = this.dailyEntries.findIndex(
      (element) => element.date === this.currentDate
    );
    if (index == -1) {
      this.entryExists = false;
      this.setAddedItems([]);
    } else {
      this.entryExists = true;
      this.setAddedItems(this.dailyEntries[index].addedItems);
      this.setItems();
    }
  },
  computed: {
    ...mapGetters("searchAndAdd", ["totalForToday", "today"]),
    ...mapState("searchAndAdd", [
      "dailyEntries",
      "dailyEntryTemp",
      "recipes",
      "currentDate",
      "editIndex",
      "query",
    ]),
    editIndex: {
      get() {
        return this.$store.state.searchAndAdd.editIndex;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setEditIndex", value);
      },
    },
    recipesPortions: {
      get() {
        return this.$store.state.searchAndAdd.recipesPortions;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/setPortions", value);
      },
    },
    recipesName: {
      get() {
        return this.$store.state.searchAndAdd.recipesName;
      },
      set(value) {
        this.$store.dispatch("searchAndAdd/nameRecipe", value);
      },
    },
  },
  methods: {
    ...mapActions("searchAndAdd", [
      "setCurrentDate",
      "setAddedItems",
      "setItems",
      "setRecipeDrag",
      "addDailyEntry",
      "setResponseData",
      "searchFood",
    ]),
  },
};
</script>

<style scoped>
.search {
  height: 64px;
  width: 80%;
  margin-top: 12px;
}
.dailyBox {
  height: 190px;
}
.middle {
  width: calc(100% - 390px);
}
.addedFoods {
  height: calc(100vh - 190px - 60px - 4 * 12px);
}
.display {
  height: calc(100vh - 2 * 12px);
  width: 390px;
}

@media only screen and (max-width: 1350px) {
  .middle {
    width: calc(100% - 320px);
  }
  .display {
    height: calc(100vh - 2 * 12px);
    width: 320px;
  }
}
@media only screen and (max-width: 769px) {
  .container {
    flex-direction: column;
  }
  .dailyBox {
    height: 190px;
  }
  .addedFoods {
    height: calc(100vh - 190px - 50px - 3 * 12px) !important;
  }
  .display {
    width: 100% !important;
    margin: 12px 0 0 0 !important;
    height: calc(40px + 3 * 12px + 2 * 214px) !important;
  }
  .middle {
    width: 100% !important;
  }
  .search {
    height: 50px;
    width: 80%;
    margin-top: 0px;
  }
}
</style>
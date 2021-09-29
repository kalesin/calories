
import axios from 'axios';
import dayjs from "dayjs";
import _ from 'underscore';

const searchAndAdd = {
    namespaced: true,
    state: () => ({
        firebase_url: "https://caloriecounter-309316-default-rtdb.firebaseio.com//data/",
        api_key: "4d036c5868dfd862b3d383c4e2d872fc",
        api_id: "8f153d95",
        api_url: "https://api.edamam.com/api/food-database/v2/parser?",
        heroku_url: "https://ancient-river-13326.herokuapp.com/food/?name=",
        query: "",
        queryRecipe: "",
        response: false,
        responseData: [],
        selectedResponse: { name: "", nutrientArray: [] },
        quantity: "",
        addedItems: [],
        items: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: [],
        },
        addedItemsRecipe: [],
        itemsPropNames: ["breakfast", "lunch", "dinner", "snack"],
        itemsIndex: -1,
        itemToAdd: [],
        dragIndex: -1,
        activeIndex: -1,
        deleted: false,
        //recipes
        recipesName: "",
        recipesPortions: 1,
        recipes: [],
        recipeDrag: false,
        //progressbar
        maintenanceCalories: 0,
        //editing recipes
        portionItem: {},
        editIndex: -1,
        dailyEntries: [],
        //calendar
        daysUnix: [],
        compareCalendar: [],
        editDate: "",
        //other
        navbarActive: true,
        currentDate: null,
        userID: null,
        favoriteSearchResults: [],
        recentSearchResults: [],
        recentSearchResultsID: [],
        resultsArray: [],
    }),
    mutations: {
        SELECT_ITEM(state, payload) {
            state.selectedResponse.name = payload.name;
            state.selectedResponse.nutrientArray = payload.nutrientArray;
        },
        CREATE_ITEM_TO_ADD(state, value) {
            state.itemToAdd = {
                NAME: state.selectedResponse.name,
                NUTRIENTS: state.selectedResponse.nutrientArray,
                QUANTITY: 100,
                CALCULATED_NUTRIENTS: state.selectedResponse.nutrientArray.map(
                    x => Math.round(x * 100) / 100
                ),
                IS_PORTION: value,
                TYPE: state.itemsIndex == -1 ? 3 : state.itemsIndex
            }
        },
        ITEM_TO_ADD(state, value) {
            state.itemToAdd = JSON.parse(JSON.stringify(value));
        },
        ADD_ITEM(state) {
            let index = state.addedItems.findIndex(element => element.NAME == state.itemToAdd.NAME && element.TYPE == state.itemToAdd.TYPE)
            if (index != -1) {
                state.addedItems[index].QUANTITY += state.itemToAdd.QUANTITY
                state.addedItems[index].CALCULATED_NUTRIENTS = state.addedItems[index].NUTRIENTS.map(
                    x => Math.round(x * state.addedItems[index].QUANTITY) / 100)
            } else {
                state.addedItems.push(state.itemToAdd)
            }
        },
        ADD_ITEM_RECIPE(state) {
            let index = state.addedItemsRecipe.findIndex(element => element.NAME == state.itemToAdd.NAME && element.TYPE == state.itemToAdd.TYPE)
            if (index != -1) {
                state.addedItemsRecipe[index].QUANTITY += state.itemToAdd.QUANTITY
                state.addedItemsRecipe[index].CALCULATED_NUTRIENTS = state.addedItemsRecipe[index].NUTRIENTS.map(
                    x => Math.round(x * state.addedItemsRecipe[index].QUANTITY) / 100)
            } else {
                state.addedItemsRecipe.push(state.itemToAdd)
            }
        },
        ADD_ITEM_VALUE(state, payload) {
            state.itemToAdd = JSON.parse(JSON.stringify(payload));
        },
        CHANGE_ITEM(state, { item, quantity }) {
            let index = state.addedItems.findIndex(element => element.NAME == item.NAME && element.TYPE == item.TYPE)
            let addedItem = state.addedItems[index]
            if (parseFloat(quantity) > 0 && quantity != '') {
                if (addedItem.IS_PORTION) {
                    addedItem.QUANTITY = parseFloat(quantity * 100);
                } else {
                    addedItem.QUANTITY = parseFloat(quantity);
                }
            }
            addedItem.CALCULATED_NUTRIENTS = addedItem.NUTRIENTS.map(
                x => Math.round(x * addedItem.QUANTITY) / 100
            );
        },
        CHANGE_ITEM_RECIPE(state, { item, quantity }) {
            let index = state.addedItemsRecipe.findIndex(element => element.NAME == item.NAME && element.TYPE == item.TYPE)
            let addedItem = state.addedItemsRecipe[index]
            if (parseFloat(quantity) > 0 && quantity != '') {
                addedItem.QUANTITY = parseFloat(quantity);
            }
            addedItem.CALCULATED_NUTRIENTS = addedItem.NUTRIENTS.map(
                x => Math.round(x * addedItem.QUANTITY) / 100
            );
        },
        REMOVE_ITEM(state, index) {
            let itemToRemove = state.items[state.itemsPropNames[state.itemsIndex]][index]
            let removeIndex = state.addedItems.findIndex(element => element.NAME == itemToRemove.NAME && element.TYPE == itemToRemove.TYPE)
            state.addedItems.splice(removeIndex, 1);
        },
        CHANGE_TYPE(state, dropIndex) {
            state.itemToAdd.TYPE = dropIndex;
        },
        REMOVE_ITEM_RECIPE(state, index) {
            state.addedItemsRecipe.splice(index, 1);
        },
        SET_QUERY(state, value) {
            state.query = value;
        },
        SET_QUERY_RECIPE(state, value) {
            state.queryRecipe = value;
        },
        SET_QUANTITY(state, value) {
            state.quantity = value;
        },
        SET_ADDED_ITEMS(state, payload) {
            state.addedItems = JSON.parse(JSON.stringify(payload));
        },
        SET_ADDED_ITEMS_RECIPE(state, payload) {
            state.addedItemsRecipe = JSON.parse(JSON.stringify(payload));
        },
        SET_ITEMS(state) {
            const _ = require("lodash");
            var items = _.groupBy(state.addedItems, "TYPE")
            for (let i = 0; i < 4; i++) {
                let prop = state.itemsPropNames[i];
                state.items[prop] = items[i] ? items[i] : []
            }
        },
        SET_ITEMS_INDEX(state, value) {
            if (state.itemsIndex == -1) {
                state.itemsIndex = value
            } else if (state.itemsIndex == value) {
                state.itemsIndex = -1
            } else if (state.itemsIndex != value) {
                state.itemsIndex = value
            }
        },
        SET_DRAG_INDEX(state, value) {
            state.dragIndex = value;
        },
        CHECK_ITEMS_INDEX(state) {
            if (state.itemsIndex == -1) {
                state.itemsIndex = 3
            }
        },
        SET_ACTIVE_INDEX(state, value) {
            state.activeIndex = value;
        },
        SET_DELETED(state, value) {
            state.deleted = value;
        },
        //recipes
        ADD_TO_RECIPES(state, { totalForRecipe, addedItemsRecipe, recipesName, recipesPortions }) {
            state.recipeName = recipesName;
            state.recipesPortions = recipesPortions;
            state.recipes.push({
                NAME: state.recipeName, //vrača objekt ker nisem hotel met property reaktivno v storu
                NUTRIENTS: totalForRecipe,
                PORTIONS: state.recipesPortions,
                PORTION_NUTRIENTS: totalForRecipe.map(
                    x => Math.round(x / state.recipesPortions * 100) / 100
                ),
                INGREDIENTS: addedItemsRecipe,
                IS_FAVORITE: false
            })
        },
        SET_RECIPES(state, value) {
            state.recipes = value;
        },
        ADD_RECIPE_NAME(state, value) {
            state.recipesName = value
        },
        ADD_RECIPE_PORTIONS(state, value) {
            state.recipesPortions = parseFloat(value)
        },
        ADD_PORTION_OF_RECIPE(state, index) {
            state.portionItem = {
                NAME: state.recipes[index].NAME,
                NUTRIENTS: state.recipes[index].PORTION_NUTRIENTS,
                QUANTITY: 100,
                CALCULATED_NUTRIENTS: state.recipes[index].PORTION_NUTRIENTS.map(
                    x => Math.round(x * 100) / 100
                ),
                IS_PORTION: true,
                TYPE: state.itemsIndex == -1 ? 3 : state.itemsIndex
            };
        },
        REMOVE_RECIPE(state) {
            state.recipes.splice(state.editIndex, 1);
        },
        SET_MAINTENANCE_CALORIES(state, value) {
            state.maintenanceCalories = parseFloat(value);
        },
        SET_EDIT_INDEX(state, index) {
            state.editIndex = index;
        },
        SAVE_INGREDIENTS(state, payload) {
            if (!(payload.recipesName === "")) {
                state.recipes[payload.editIndex].NAME = payload.recipesName.toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
            }
            if (!(payload.recipesPortions === "")) {
                state.recipes[payload.editIndex].PORTIONS = payload.recipesPortions;
            }
            state.recipes[payload.editIndex].INGREDIENTS = payload.addedItemsRecipe;
            state.recipes[payload.editIndex].NUTRIENTS = payload.totalForRecipe;
            state.recipes[payload.editIndex].PORTION_NUTRIENTS = payload.totalForRecipe.map(
                x => Math.round(x / state.recipes[payload.editIndex].PORTIONS * 100) / 100);
        },
        //daily entry list
        SORT_DAILY_ENTRIES(state) {
            state.dailyEntries.sort((a, b) => a.unix - b.unix)
        },
        SET_DAILY_ENTRIES(state, value) {
            state.dailyEntries = value;
        },
        ADD_DAILY_ENTRY(state, payload) {
            state.dailyEntries.push({
                date: state.currentDate,
                unix: new Date(state.currentDate.split("-").join(".")).getTime() / 1000,
                addedItems: state.addedItems,
                total: payload
            })
        },
        //calendar
        SET_DAYS_UNIX(state, value) {
            state.daysUnix = value
        },
        REMOVE_ENTRY(state, index) {
            state.dailyEntries.splice(index, 1);
        },
        SET_EDIT_DATE(state, value) {
            state.editDate = value;
        },
        SET_FAVORITE(state, index) {
            state.recipes[index].IS_FAVORITE = !state.recipes[index].IS_FAVORITE;
            let arrayFavorite = JSON.parse(JSON.stringify(state.recipes));
            let array1 = arrayFavorite.filter(element => element.IS_FAVORITE == true)
            let array2 = arrayFavorite.filter(element => element.IS_FAVORITE == false)
            arrayFavorite = array1.concat(array2);
            state.recipes = JSON.parse(JSON.stringify(arrayFavorite))
        },
        SET_NAVBARACTIVE(state, value) {
            state.navbarActive = value;
        },
        SET_CURRENT_DATE(state, date) {
            state.currentDate = date
        },
        SET_USER_ID(state, value) {
            state.userID = value.uid
        },
        SET_RECIPE_DRAG(state, value) {
            state.recipeDrag = value;
        },
        SET_RESPONSE(state, value) {
            state.response = value;
        },
        SET_RESPONSE_DATA(state, value) {
            state.responseData = value;
        },
        FAVORITE_SEARCH_RESULTS(state, value) {
            let index = state.favoriteSearchResults.findIndex((el) => el == value);
            if (index == -1) {
                state.favoriteSearchResults.push(value)
            } else {
                state.favoriteSearchResults.splice(index, 1)
            }
        },
        SET_FAVORITE_SEARCH_RESULTS(state, value) {
            state.favoriteSearchResults = value;
        },
        RECENT_SEARCH_RESULTS(state, value) {
            let recentOnlyIDsArray = [];
            for (let i = 0; i < state.recentSearchResults.length; i++) {
                recentOnlyIDsArray
                    .push(state.recentSearchResults[i].id)
            }
            let index = recentOnlyIDsArray.indexOf(value);
            if (!state.favoriteSearchResults.includes(value)) {
                if (recentOnlyIDsArray.length == 0) {
                    state.recentSearchResults.push({ id: value, lastAdded: dayjs() })
                }
                else {
                    if (index != -1) {
                        state.recentSearchResults[index].lastAdded = dayjs();
                    } else {
                        if (recentOnlyIDsArray.length >= 100) {
                            state.recentSearchResults.splice(0, 1)
                        }
                        state.recentSearchResults.push({ id: value, lastAdded: dayjs() })
                    }
                }
            }
        },
        SET_RECENT_SEARCH_RESULTS(state, value) {
            state.recentSearchResults = value;
        },
    },
    actions: {
        async searchFood({ state, commit }, { query }) {
            return axios
                .get(
                    `${state.heroku_url}${query}`
                )
                .then(
                    response => {
                        commit("SET_RESPONSE", false);
                        //preoblikovanje podatkov v arrayFavorite
                        let i = 0;
                        while (response.data[i]) {
                            state.responseData[i] = { name: null, id: null, nutrientArray: [] }
                            state.responseData[i].name = response.data[i].name;
                            state.responseData[i].id = response.data[i].id;
                            state.responseData[i].nutrientArray = [
                                response.data[i].energy,
                                parseFloat(response.data[i].protein),
                                parseFloat(response.data[i].carbohydrates),
                                parseFloat(response.data[i].fat),
                                parseFloat(response.data[i].fiber),
                            ]
                            state.responseData[i].favorite = false;
                            state.responseData[i].lastAdded = null;
                            i++;
                        }
                        //sortiranje po favoritih
                        //narediš array IDjev za primerjat
                        let responseDataOnlyIDsArray = [];
                        for (let i = 0; i < state.responseData.length; i++) {
                            responseDataOnlyIDsArray.push(state.responseData[i].id)
                        }
                        let recentOnlyIDsArray = [];
                        for (let i = 0; i < state.recentSearchResults.length; i++) {
                            recentOnlyIDsArray
                                .push(state.recentSearchResults[i].id)
                        }
                        //primerjaš
                        let commonFavoriteIDs = _.intersection(responseDataOnlyIDsArray, state.favoriteSearchResults)
                        let commonRecentIDs = _.intersection(responseDataOnlyIDsArray, recentOnlyIDsArray
                        )
                        for (let i = 0; i < state.responseData.length; i++) {
                            for (let j = 0; j < commonFavoriteIDs.length; j++) {
                                if (state.responseData[i].id == commonFavoriteIDs[j]) {
                                    //označiš favorite
                                    state.responseData[i].favorite = true;
                                }
                            }
                        }
                        for (let i = 0; i < state.responseData.length; i++) {
                            for (let j = 0; j < commonRecentIDs.length; j++) {
                                if (state.responseData[i].id == commonRecentIDs[j]) {
                                    //kopiraš time v responseData array
                                    state.responseData[i].lastAdded = dayjs(state.recentSearchResults[recentOnlyIDsArray.indexOf(commonRecentIDs[j])].lastAdded).valueOf();
                                }
                            }
                        }
                        //sortiraš
                        let favorite = state.responseData.filter(el => el.favorite).sort()
                        let recent = state.responseData.filter(el => el.lastAdded && !el.favorite).sort((a, b) =>
                            parseFloat(a.lastAdded) - parseFloat(b.lastAdded)).reverse();
                        //convert back from unix timestamp
                        for (let i = 0; i < recent.length; i++) {
                            recent[i].lastAdded = dayjs(recent[i].lastAdded);
                        }
                        let rest = state.responseData.filter(el => !el.favorite && !el.lastAdded)
                        state.responseData = favorite.concat(recent, rest)
                        console.log(state.responseData)
                        commit("SET_RESPONSE", true);
                    }
                ).catch(function (error) {
                    console.log(error);
                })
        },
        selectFood({ state, commit }, { searchRecipe, choiceIndex }) {
            commit("SELECT_ITEM", state.responseData[choiceIndex])
            commit("RECENT_SEARCH_RESULTS", state.responseData[choiceIndex].id)
            let index = -1;
            let items = !searchRecipe ? state.items[state.itemsPropNames[state.itemsIndex]] : state.addedItemsRecipe
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].NAME === state.selectedResponse.name) {
                        index = i;
                    }
                }
            }
            if (index != -1) {
                commit("SET_ACTIVE_INDEX", index)
            } else {
                commit("CREATE_ITEM_TO_ADD", false)
                if (!searchRecipe) {
                    commit("SET_ACTIVE_INDEX", items.length)
                    commit("ADD_ITEM")
                } else {
                    commit("SET_ACTIVE_INDEX", state.addedItemsRecipe.length)
                    commit("ADD_ITEM_RECIPE")
                }
            }
            commit("SET_RESPONSE", false);
        },
        addItem({ state, getters, commit }) {
            commit("ADD_ITEM")
        },
        addItemValue({ state, commit }, payload) {
            let items = state.itemsIndex == -1 ? state.items[state.itemsPropNames[3]] : state.items[state.itemsPropNames[state.itemsIndex]];
            let index = items.findIndex(element => element.NAME === payload.NAME);
            if (index != -1) {
                commit("SET_ACTIVE_INDEX", index)
            } else {
                commit("ADD_ITEM_VALUE", payload)
                commit("ADD_ITEM")
                commit("SET_ACTIVE_INDEX", items.length)
            }
        },
        onChanged({ commit }, { item, quantity }) {
            commit("CHANGE_ITEM", { item, quantity })
            commit("SET_QUANTITY", "")
            commit("SET_ACTIVE_INDEX", -1)
        },
        onChangedRecipe({ commit }, { item, quantity }) {
            commit("CHANGE_ITEM_RECIPE", { item, quantity })
            commit("SET_QUANTITY", "")
            commit("SET_ACTIVE_INDEX", -1)
        },
        onRemoved({ commit }, index) {
            commit("REMOVE_ITEM", index)
            commit("SET_DELETED", true)
            commit("SET_ACTIVE_INDEX", -1)
        },
        onRemovedRecipe({ state, getters, commit }, index) {
            commit("REMOVE_ITEM_RECIPE", index)
            commit("SET_DELETED", true)
            commit("SET_ACTIVE_INDEX", -1)
        },
        changeType({ state, commit }, value) {
            commit("CHANGE_TYPE", value)
        },
        setQuery({ state, commit }, value) {
            commit("SET_QUERY", value)
        },
        setQueryRecipe({ state, commit }, value) {
            commit("SET_QUERY_RECIPE", value)
        },
        setQuantity({ state, commit }, value) {
            commit("SET_QUANTITY", value)
        },
        setAddedItems({ state, commit }, payload) {
            commit("SET_ADDED_ITEMS", payload)
        },
        setAddedItemsRecipe({ state, commit }, payload) {
            commit("SET_ADDED_ITEMS_RECIPE", payload)
        },
        setItems({ state, commit }) {
            commit("SET_ITEMS")
        },
        setItemsIndex({ state, commit }, value) {
            commit("SET_ITEMS_INDEX", value)
        },
        dragAndDropItem({ commit }, payload) {
            commit("ITEM_TO_ADD", payload.item)
            commit("SET_DRAG_INDEX", payload.index)
        },
        checkItemsIndex({ commit }) {
            commit("CHECK_ITEMS_INDEX")
        },
        setDeleted({ state, commit }, value) {
            commit("SET_DELETED", value)
        },
        setActiveIndex({ state, commit }, value) {
            if (state.activeIndex != -1 || state.deleted) {
                commit("SET_QUANTITY", "")
                commit("SET_ACTIVE_INDEX", -1)
                commit("SET_DELETED", false)
            } else {
                commit("SET_ACTIVE_INDEX", value)
            }
        },
        //recipes
        nameRecipe({ state, commit }, value) {
            commit("ADD_RECIPE_NAME", value)
        },
        setPortions({ state, commit }, value) {
            commit("ADD_RECIPE_PORTIONS", value)
        },
        addToRecipes({ state, commit }, { totalForRecipe, addedItemsRecipe, recipesName, recipesPortions }) {
            commit("ADD_TO_RECIPES", { totalForRecipe, addedItemsRecipe, recipesName, recipesPortions })
        },
        addPortionOfRecipe({ state, commit }, index) {
            commit("ADD_PORTION_OF_RECIPE", index)
        },
        removeRecipe({ state, commit }) {
            commit("REMOVE_RECIPE")
            commit("SET_EDIT_INDEX", -1)
        },
        //progressbar
        setMaintenanceCalories({ state, commit }, payload) {
            commit("SET_MAINTENANCE_CALORIES", payload);
            axios.patch(`${state.axios_url}` + `${state.userID}` + "/.json", { maintenanceCalories: state.maintenanceCalories })
        },
        saveIngredients({ state, commit }, payload) {
            commit("SAVE_INGREDIENTS", payload)
        },
        setEditIndex({ state, commit }, index) {
            commit("SET_EDIT_INDEX", index)
        },
        //entries
        addDailyEntry({ state, commit, getters }) {
            let index = state.dailyEntries.findIndex((element) => element.date === state.currentDate);
            if (state.addedItems.length !== 0) {
                if (index !== -1) {
                    commit("REMOVE_ENTRY", index)
                }
                commit("ADD_DAILY_ENTRY", getters.totalForToday)
            } else {
                if (index !== -1) {
                    commit("REMOVE_ENTRY", index)
                }
            }
            commit("SORT_DAILY_ENTRIES")
        },
        resetDailyEntry({ state, commit }) {
            let index = state.dailyEntries.findIndex((element) => element.date === state.currentDate);
            if (index !== -1) {
                commit("REMOVE_ENTRY", index)
            }
            commit("SET_ADDED_ITEMS", [])
            commit("SORT_DAILY_ENTRIES")
        },
        //calendar
        setDaysUnix({ state, commit }, value) {
            commit("SET_DAYS_UNIX", value)
        },
        setEditDate({ state, commit }, value) {
            commit("SET_EDIT_DATE", value)
        },
        setFavorite({ state, commit }, index) {
            commit("SET_FAVORITE", index)
        },
        setNavbarActive({ commit }, value) {
            commit("SET_NAVBARACTIVE", value)
        },
        setCurrentDate({ commit }, value) {
            commit("SET_CURRENT_DATE", value)
        },
        setRecipeDrag({ commit }, value) {
            commit("SET_RECIPE_DRAG", value)
        },
        setResponseData({ commit }, value) {
            commit("SET_RESPONSE_DATA", value)
        },
        setFavoriteSearchResults({ commit }, value) {
            commit("FAVORITE_SEARCH_RESULTS", value)
        }
    },
    getters: {
        totalForToday(state) {
            let totalNutrient = [];
            for (let j = 0; j < 5; j++) {
                totalNutrient[j] = 0;
                for (let i = 0; i < state.addedItems.length; i++) {
                    totalNutrient[j] += state.addedItems[i].CALCULATED_NUTRIENTS[j];
                }
                totalNutrient[j] = Math.round(totalNutrient[j]);
            }
            return totalNutrient;
        },
        totalForRecipe(state) {
            let totalNutrient = [];
            for (let j = 0; j < 5; j++) {
                totalNutrient[j] = 0;
                for (let i = 0; i < state.addedItemsRecipe.length; i++) {
                    totalNutrient[j] += state.addedItemsRecipe[i].CALCULATED_NUTRIENTS[j];
                }
                totalNutrient[j] = totalNutrient[j];
            }
            return totalNutrient;
        },
        compareCalendar(state) {
            let same = state.daysUnix;
            for (let i = 0; i < same.length; i++) {
                for (let j = 0; j < state.dailyEntries.length; j++) {
                    if (same[i].date === state.dailyEntries[j].date) {
                        same[i] = {
                            ...same[i],
                            entryExists: true,
                            entry: state.dailyEntries[j]
                        };
                    }
                }
            }
            return same;
        },
        today(state) {
            return state.currentDate ? state.currentDate : dayjs().format("YYYY-MM-DD")
        }
    }
}

export default searchAndAdd


import axios from 'axios';
import dayjs from "dayjs";

const searchAndAdd = {
    namespaced: true,
    state: () => ({
        axios_url: "https://caloriecounter-309316-default-rtdb.firebaseio.com//data/",
        api_key: "4d036c5868dfd862b3d383c4e2d872fc",
        api_id: "8f153d95",
        api_url: "https://api.edamam.com/api/food-database/v2/parser?",
        query: "",
        queryRecipe: "",
        responseData: 0,
        quantity: "",
        foodLabel: "",
        nutrients: 0,
        nutrientsArray: [],
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
        userID: null
    }),
    mutations: {
        SET_SEARCH_RESPONSE(state, payload) {
            state.foodLabel = payload.label;
            state.nutrients = {
                NAME: payload.label,
                ENERGY: payload.nutrients.ENERC_KCAL || 0,
                CARB: payload.nutrients.CHOCDF || 0,
                FAT: payload.nutrients.FAT || 0,
                FIBER: payload.nutrients.FIBTG || 0,
                PROTEIN: payload.nutrients.PROCNT || 0
            };
            state.nutrientsArray = [
                state.nutrients.ENERGY,
                state.nutrients.PROTEIN,
                state.nutrients.CARB,
                state.nutrients.FAT,
                state.nutrients.FIBER
            ];
        },
        CREATE_ITEM_TO_ADD(state, value) {
            state.itemToAdd = {
                NAME: state.nutrients.NAME,
                NUTRIENTS: state.nutrientsArray,
                QUANTITY: 100,
                CALCULATED_NUTRIENTS: state.nutrientsArray.map(
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
            let array = JSON.parse(JSON.stringify(state.recipes));
            let array1 = array.filter(element => element.IS_FAVORITE == true)
            let array2 = array.filter(element => element.IS_FAVORITE == false)
            array = array1.concat(array2);
            state.recipes = JSON.parse(JSON.stringify(array))
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
        }
    },
    actions: {
        async searchFood({ state, getters, commit }, { query, searchRecipe }) {
            return axios
                .get(
                    `${state.api_url}ingr=${query}&app_id=${state.api_id}&app_key=${state.api_key}`
                )
                .then(
                    response => {
                        console.log(response.data.hints)
                        let responseIndex = response.data.hints.findIndex(e => e.food.label.toLowerCase() === query)
                        console.log(responseIndex)
                        let responseResult = null;
                        if (responseIndex == -1) {
                            responseResult = response.data.hints[0].food
                        } else {
                            responseResult = response.data.hints[responseIndex].food
                        }
                        console.log(responseResult)

                        commit("SET_SEARCH_RESPONSE", responseResult)
                        let index = -1;
                        let items = !searchRecipe ? state.items[state.itemsPropNames[state.itemsIndex]] : state.addedItemsRecipe
                        if (items) {
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].NAME === responseResult.label) {
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
                    }
                ).catch(function (error) {
                    console.log(error);
                })
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

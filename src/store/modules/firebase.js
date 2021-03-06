import Vue from 'vue';

const firebase = {
    namespaced: true,
    state: () => ({
        loggedIn: false,
        userData: [],
        password: "",
        email: "",
        userID: "",
        user: {},
        newUser: false,
        setData: false,
        setAuth: false
    }),
    mutations: {
        SET_LOGGEDIN(state, value) {
            state.loggedIn = value;
        },
        SET_PASSWORD(state, value) {
            state.password = value;
        },
        SET_EMAIL(state, value) {
            state.email = value;
        },
        SET_USER(state, value) {
            state.userID = value.uid
            state.user = value;
        },
        SET_USER_ID(state, value) {
            state.userID = value
        },
        SET_DATA(state, value) {
            state.setData = value
        },
        SET_AUTH(state, value) {
            state.setAuth = value
        },
        SET_NEW_USER(state, value) {
            state.newUser = value
        }
    },
    actions: {
        async getData({ state, commit }) {
            let id = state.userID;
            return Vue.http.get(`data/${id}.json?auth=${state.user.token}`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        let recipes = data.recipes ? data.recipes : [];
                        let maintenanceCalories = data.maintenanceCalories ? data.maintenanceCalories : 2000;
                        let dailyEntries = data.dailyEntries ? data.dailyEntries : [];
                        let favoriteSearchResults = data.favoriteSearchResults ? data.favoriteSearchResults : [];
                        let recentSearchResults = data.recentSearchResults ? data.recentSearchResults : [];
                        commit('searchAndAdd/SET_RECIPES', recipes, { root: true })
                        commit('searchAndAdd/SET_MAINTENANCE_CALORIES', maintenanceCalories, { root: true })
                        commit('searchAndAdd/SET_DAILY_ENTRIES', dailyEntries, { root: true })
                        commit('searchAndAdd/SET_FAVORITE_SEARCH_RESULTS', favoriteSearchResults, { root: true })
                        commit('searchAndAdd/SET_RECENT_SEARCH_RESULTS', recentSearchResults, { root: true })
                    } else {
                        commit('searchAndAdd/SET_MAINTENANCE_CALORIES', 2000, { root: true })
                    }
                }).catch(function (error) {
                    console.log(error);
                })
        },
        setLoggedIn({ state, commit }, value) {
            commit("SET_LOGGEDIN", value);
        },
        setPassword({ state, commit }, value) {
            commit("SET_PASSWORD", value);
        },
        setEmail({ state, commit }, value) {
            commit("SET_EMAIL", value);
        },
        setUser({ commit }, {user, token}) {
            if (user.uid) {
                commit("SET_USER", { displayName: user.displayName, uid: user.uid, photoURL: user.photoURL, token: token})
                commit("searchAndAdd/SET_USER_ID", user, { root: true })
            } else {
                commit("SET_USER", null)
            }
        },
        setData({ commit }, value) {
            commit("SET_DATA", value)
        },
        setAuth({ commit }, value) {
            commit("SET_AUTH", value)
        },
        setNewUser({ commit }, value) {
            commit("SET_NEW_USER", value)
        },
        setUserID({ commit }, value) {
            commit("SET_USER_ID", value)
        }
    },
    getters: {

    }
}

export default firebase

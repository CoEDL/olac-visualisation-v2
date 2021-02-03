import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const mutations = {
  saveCountries(state, countries) {
    state.countries = [...countries];
  },
  saveLanguages(state, languages) {
    state.languages = [...languages];
  },
};

export const actions = {
  async loadData({ commit }) {
    let response = await fetch("/repository/indexes/countries.json");
    if (response.status !== 200) {
      console.log(`Unable to load country data`);
      return;
    }
    let countries = await response.json();
    commit("saveCountries", countries);

    response = await fetch("/repository/indexes/languages.json");
    if (response.status !== 200) {
      console.log(`Unable to load country data`);
      return;
    }
    let languages = await response.json();
    commit("saveLanguages", languages);
  },
};

export default new Vuex.Store({
  state: {
    countries: [],
    languages: [],
  },
  mutations,
  actions,
  modules: {},
});

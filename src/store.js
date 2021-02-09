import Vue from "vue";
import Vuex from "vuex";
import { debounce } from "lodash";
const repository =
  process.env.NODE_ENV === "development"
    ? "/repository"
    : "/olacvis/repository";

Vue.use(Vuex);
const debouncedLoadData = debounce(loadData, 100);
const debouncedLoadLanguage = debounce(loadLanguage, 500);

export const mutations = {
  saveCountries(state, countries) {
    state.countries = [...countries];
  },
  saveLanguages(state, languages) {
    state.languages = [...languages];
  },
  saveLanguage(state, language) {
    state.selectedLanguage = { ...language };
  },
  setColorScheme(state, scheme) {
    state.colorScheme = { ...scheme };
  },
  toggleLanguageResources(state) {
    state.showLanguageResources = {
      ...{
        visible: !state.showLanguageResources.visible,
      },
    };
  },
};

export const actions = {
  loadData: debouncedLoadData,
  loadLanguage: debouncedLoadLanguage,
};

export default new Vuex.Store({
  state: {
    countries: [],
    languages: [],
    selectedLanguage: {},
    colorScheme: { scheme: "normal" },
    showLanguageResources: { visible: false },
  },
  mutations,
  actions,
  modules: {},
});

async function loadData({ commit }) {
  let response = await fetch(`${repository}/indexes/languages.json`);
  if (response.status !== 200) {
    console.log(`Unable to load language data`);
    return;
  }
  let languages = await response.json();
  commit("saveLanguages", languages);

  response = await fetch(`${repository}/indexes/countries.json`);
  if (response.status !== 200) {
    console.log(`Unable to load country data`);
    return;
  }
  let countries = await response.json();
  commit("saveCountries", countries);
}

async function loadLanguage({ commit }, { code }) {
  commit("saveLanguage", {});
  if (!code) return;
  await new Promise(resolve => setTimeout(resolve, 500));
  let response = await fetch(`${repository}/languages/json/${code}.json`);
  if (response.status !== 200) {
    console.log(`Unable to load language data`);
    return;
  }
  let language = await response.json();
  commit("saveLanguage", language);
}

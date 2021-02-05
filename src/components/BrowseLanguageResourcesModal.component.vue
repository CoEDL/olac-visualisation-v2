<template>
  <div>
    <ui-button color="primary" size="large" @click="exploreLanguageResources">
      explore language resources
    </ui-button>

    <ui-modal
      ref="browseModal"
      title="Explore Language Resources"
      size="fullscreen"
    >
      <!-- modal -->
      <div slot="header" class="text-lg">
        <i class="fas fa-sign-language"></i>
        {{ selectedLanguage.name }}
      </div>

      <!-- content -->
      <div class="flex flex-col text-base space-y-8 py-4 px-8">
        <div class="">Also known as: {{ otherNamesAndDialects }}</div>
        <language-summary-component />

        <!-- type buttons -->
        <div class="flex flex-col mt-8">
          <div>Search by type:</div>
          <div class="flex flex-row space-x-1">
            <div v-for="(type, idx) of types" :key="idx">
              <ui-button size="small" color="primary" @click="setType(type)">{{
                type
              }}</ui-button>
            </div>
          </div>
        </div>

        <!-- language resource autocomplete -->
        <ui-textbox
          ref="searchAutocomplete"
          class="my-6"
          placeholder="Search language resources"
          v-model="searchText"
          v-on:input="debouncedSearchResources"
        >
        </ui-textbox>

        <div>Total number of matches: {{ totalMatches }}</div>
        <!-- search results -->
        <div class="flex flex-col space-y-2">
          <div v-for="(result, idx) of results" :key="result.resourceName">
            <div class="flex flex-row">
              <div class="flex flex-col">
                <div class="w-10">{{ idx + 1 }}.</div>
              </div>
              <div class="text-base flex flex-col">
                <div class="flex-grow flex flex-row">
                  <a
                    :href="result.resourceLink.url"
                    target="_name"
                    class="text-yellow-600 hover:underline"
                    >{{ result.resourceName }}</a
                  >
                </div>
                <div class="text-sm">{{ result.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ui-modal>
  </div>
</template>

<script>
import { flattenDeep, debounce } from "lodash";
import Fuse from "fuse.js";
import LanguageSummaryComponent from "./LanguageSummary.component.vue";

export default {
  components: {
    LanguageSummaryComponent,
  },
  data() {
    return {
      fuse: undefined,
      results: [],
      totalMatches: undefined,
      searchText: undefined,
      modalHeight: `${window.innerHeight * 0.8}px`,
      debouncedSearchResources: debounce(this.searchResources, 800),
    };
  },
  computed: {
    selectedLanguage() {
      return this.$store.state.selectedLanguage;
    },
    otherNamesAndDialects() {
      return this.selectedLanguage.otherNamesAndDialects.join(", ");
    },
    types() {
      return Object.keys(this.$store.state.selectedLanguage.summary);
    },
  },
  mounted() {
    this.createSearchIndex();
  },
  methods: {
    exploreLanguageResources() {
      this.$refs.browseModal.open();
    },
    createSearchIndex() {
      let resources = this.$store.state.selectedLanguage.resources;
      const types = Object.keys(resources);
      resources = types.map(type => resources[type].map(e => ({ type, ...e })));
      resources = flattenDeep(resources);

      const options = {
        threshold: 0.1,
        ignoreLocation: true,
        findAllMatches: true,
        keys: [
          "type",
          `isOnline`,
          `resourceName`,
          `resourceLink.name`,
          `resourceLink.url`,
        ],
      };
      this.fuse = new Fuse(resources, options);
    },
    searchResources(suggestion) {
      if (suggestion.length > 2) {
        let results = this.fuse.search(suggestion);
        this.results = results.slice(0, 50).map(r => r.item);
        this.totalMatches = results.length;
      } else {
        this.results = [];
      }
    },
    setType(type) {
      this.searchText = type;
      this.searchResources(type);
    },
  },
};
</script>

<style lang="scss">
// .ui-focus-container__content {
//   height: calc(100vh * 0.8);
// }

// .style-panel {
//   height: calc(100vh * 0.8) - 100;
// }
</style>

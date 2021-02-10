<template>
  <div>
    <div v-if="disableSearch" class="flex flex-col">
      <div>
        Search is currently disabled for this language as there are too many
        resources. You can browse the resources at the Language Archives site:
        <a
          class="text-yellow-600 hover:underline"
          target="_blank"
          :href="selectedLanguage.dataFile"
        >
          {{ selectedLanguage.dataFile }}
        </a>
      </div>
    </div>
    <div v-if="!disableSearch" class="flex flex-col space-y-4">
      <el-radio-group
        v-model="resourcesToSearch"
        class="flex flex-row"
        @change="handleTypeFilterSelection"
      >
        <el-radio-button label="all" size="small"></el-radio-button>
        <div v-for="(type, idx) of types" :key="idx">
          <el-radio-button :label="type" size="small"></el-radio-button>
        </div>
      </el-radio-group>

      <el-input
        :clearable="true"
        placeholder="Search for..."
        v-model="searchText"
        @change="debouncedSearchResources"
        @input="debouncedSearchResources"
        @clear="debouncedSearchResources"
      />
      <!-- <pre>{{ resources[0] }}</pre> -->

      <div class="flex flex-row">
        <div class="pt-1">Total: {{ totalMatches }}</div>

        <el-pagination
          class="ml-1"
          layout="prev, pager, next"
          :total="totalMatches"
          :current-page="page"
          :page-size="pageSize"
          @current-change="setPage"
        >
        </el-pagination>
      </div>
      <!-- search results -->
      <div class="flex flex-col space-y-2">
        <div v-for="(result, idx) of results" :key="result.id">
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
  </div>
</template>

<script>
import { flattenDeep, debounce } from "lodash";
import Fuse from "fuse.js";

export default {
  components: {},
  data() {
    return {
      debouncedSearchResources: debounce(this.searchResources, 800),
      disableSearch: false,
      maxSearchTotal: 10000,
      page: 1,
      pageSize: 50,
      resourcesToSearch: "all",
      fuse: undefined,
      filterType: undefined,
      totalMatches: undefined,
      searchText: undefined,
      searchResults: [],
    };
  },
  computed: {
    selectedLanguage() {
      return this.$store.state.selectedLanguage;
    },
    types() {
      return Object.keys(this.$store.state.selectedLanguage.summary);
    },
    resources() {
      let resources = this.$store.state.selectedLanguage.resources;
      const types = Object.keys(resources);
      resources = types.map(type =>
        resources[type].map(e => ({
          type,
          ...e,
          id: `${type}_${e.resourceName}_${e.resourceLink.url}}`,
        }))
      );
      return flattenDeep(resources);
    },
    results() {
      let page = this.page - 1;
      return this.searchResults.slice(
        page * this.pageSize,
        page * this.pageSize + this.pageSize
      );
    },
  },
  mounted() {
    if (this.selectedLanguage.totalResources < this.maxSearchTotal) {
      this.createSearchIndex();
    } else {
      this.disableSearch = true;
    }
  },
  methods: {
    createSearchIndex() {
      const options = {
        threshold: 0.1,
        ignoreLocation: true,
        findAllMatches: true,
        includeMatches: true,
        keys: [
          "type",
          `isOnline`,
          `resourceName`,
          `resourceLink.name`,
          `resourceLink.url`,
        ],
      };
      this.fuse = new Fuse(this.resources, options);
      this.searchResources();
    },
    searchResources(suggestion) {
      if (!suggestion) suggestion = " ";
      let query, results;
      if (this.resourcesToSearch === "all") {
        results = this.fuse.search(suggestion);
      } else {
        query = [
          { type: this.resourcesToSearch },
          {
            $or: [{ resourceName: suggestion }],
          },
        ];
        results = this.fuse.search({ $and: query });
      }
      this.searchResults = results.map(r => r.item);
      this.page = 1;
      this.totalMatches = results.length;
    },
    handleTypeFilterSelection() {
      this.searchResources();
    },
    setPage(page) {
      this.page = page;
    },
  },
};
</script>

<style lang="scss"></style>

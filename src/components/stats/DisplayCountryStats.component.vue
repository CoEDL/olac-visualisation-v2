<template>
  <div>
    <div class="flex flex-col" v-if="country">
      <div class="flex flex-row space-x-2">
        <map-component :geojson="country.geojson" />
        <div class="flex-grow flex flex-col">
          <div class="text-2xl my-2">{{ country.name }}</div>
          <div>Alpha-2: {{ country.code }}</div>
          <div>Alpha-3: {{ country["alpha-3"] }}</div>
          <div>Region: {{ country.region }}</div>
          <div>Sub-region: {{ country["sub-region"] }}</div>
          <div>Number of languages: {{ totalLanguages }}</div>
          <div class="my-2">
            <el-button
              @click="assembleCSV"
              size="mini"
              class="text-yellow-600 hover:underline"
            >
              <i class="fas fa-file-download"></i>&nbsp;download data as
              CSV</el-button
            >
          </div>
        </div>
      </div>
      <div class="mt-10 mb-4 border-b border-solid">Language Resources</div>
      <div>
        <el-pagination
          layout="prev, pager, next"
          :total="totalLanguages"
          :page-size="pageSize"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
      <el-table :data="languages" style="width: 100%">
        <el-table-column prop="name" label="Name" width="300">
        </el-table-column>
        <el-table-column prop="code" label="code" width="60"> </el-table-column>
        <el-table-column prop="totalResources" width="62" label="Count">
        </el-table-column>
        <el-table-column prop="summary" label="Summary">
          <template slot-scope="scope" class="flex flex-col">
            <ul>
              <render-language-statistic-component
                type="Primary texts"
                :summary="scope.row.summary"
              />
              <render-language-statistic-component
                type="Lexical resources"
                :summary="scope.row.summary"
              />
              <render-language-statistic-component
                type="Language descriptions"
                :summary="scope.row.summary"
              />
              <render-language-statistic-component
                type="Other resources about the language"
                :summary="scope.row.summary"
              />
              <render-language-statistic-component
                type="Other resources in the language"
                :summary="scope.row.summary"
              />
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          prop="dataUrl"
          width="100"
          label="Download"
          align="center"
        >
          <template slot-scope="scope">
            <a
              class="text-yellow-600 hover:underline"
              :href="getUrl(scope.row.dataUrl)"
              :download="getDownloadName(scope.row.code)"
              ><i class="fas fa-file-download text-2xl"></i
            ></a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { uniq, flattenDeep } from "lodash";
import MapComponent from "./Map.component.vue";
import RenderLanguageStatisticComponent from "./RenderLanguageStatistic.component.vue";
import { getDataDownloadUrl } from "src/store";
export default {
  components: {
    MapComponent,
    RenderLanguageStatisticComponent,
  },
  props: {
    country: {
      type: Object | undefined,
      required: true,
    },
  },
  data() {
    return {
      page: 0,
      pageSize: 10,
    };
  },
  computed: {
    totalLanguages: function() {
      return this.country.languages.length;
    },
    languages: function() {
      let page = this.page;
      let pageSize = this.pageSize;
      return this.country.languages.slice(
        page * pageSize,
        page * pageSize + pageSize
      );
    },
  },
  mounted() {},
  methods: {
    assembleCSV() {
      let resourceTypes = this.country.languages.map(c =>
        Object.keys(c.summary)
      );
      resourceTypes = uniq(flattenDeep(resourceTypes)).sort();

      let csv = [
        "code",
        "name",
        "olacSource",
        "olacvisDataFile",
        "total",
        ...resourceTypes,
      ];
      let data = this.country.languages.map(c => {
        return flattenDeep([
          c.code,
          c.name,
          c.dataFile,
          `${window.origin}${this.getUrl(c.dataUrl)}`,
          c.totalResources,
          resourceTypes.map(t => c.summary[t] || 0),
        ]);
      });
      csv = [csv, ...data];
      csv = csv.map(e => e.join(",")).join("\n");
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
      );
      element.setAttribute(
        "download",
        `${this.country.code}-${encodeURIComponent(this.country.name)}-data.csv`
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    getUrl(file) {
      return getDataDownloadUrl(file);
    },
    getDownloadName(code) {
      return `${code}.json`;
    },
    changePage(page) {
      this.page = page - 1;
    },
  },
};
</script>

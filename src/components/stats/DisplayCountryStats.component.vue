<template>
  <div class="flex flex-col" v-if="country">
    <div class="flex flex-row space-x-2">
      <map-component :geojson="country.geojson" />
      <div class="flex-grow flex flex-col">
        <div class="text-2xl my-2">{{ country.name }}</div>
        <div>Alpha-2: {{ country.code }}</div>
        <div>Alpha-3: {{ country["alpha-3"] }}</div>
        <div>Region: {{ country.region }}</div>
        <div>Sub-region: {{ country["sub-region"] }}</div>
      </div>
    </div>
    <!-- <pre>{{ country }}</pre> -->
    <div class="mt-10 mb-4 border-b border-solid">Language Resources</div>
    <el-table :data="country.languages" style="width: 100%">
      <el-table-column prop="name" label="Name" width="300"> </el-table-column>
      <el-table-column prop="code" label="code" width="60"> </el-table-column>
      <el-table-column prop="totalResources" width="62" label="Count">
      </el-table-column>
      <el-table-column prop="summary" label="Summary">
        <template slot-scope="scope" class="flex flex-col">
          <div v-if="scope.row.summary['Primary Texts']">
            Primary Texts: {{ scope.row.summary["Primary Texts"] }}
          </div>
          <div v-if="scope.row.summary['Lexical Resources']">
            Lexical Resources: {{ scope.row.summary["Lexical Resources"] }}
          </div>
          <div v-if="scope.row.summary['Language Descriptions']">
            Language Descriptions:
            {{ scope.row.summary["Language Descriptions"] }}
          </div>
          <div v-if="scope.row.summary['Other resources about the language']">
            Other resources about the language:
            {{ scope.row.summary["Other resources about the language"] }}
          </div>
          <div v-if="scope.row.summary['Other resources in the language']">
            Other resources in the language:
            {{ scope.row.summary["Other resources in the language"] }}
          </div>
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
</template>

<script>
import MapComponent from "./Map.component.vue";
import { getDataDownloadUrl } from "src/store";
export default {
  components: {
    MapComponent,
  },
  props: {
    country: {
      type: Object | undefined,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    getUrl(file) {
      return getDataDownloadUrl(file);
    },
    getDownloadName(code) {
      return `${code}.json`;
    },
  },
};
</script>

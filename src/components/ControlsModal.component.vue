<template>
  <div class="flex flex-col">
    <div class="">
      <el-button
        @click="dialogVisible = !dialogVisible"
        size="small"
        class="text-yellow-600"
      >
        <i class="fas fa-sliders-h"></i>
      </el-button>
    </div>

    <el-dialog
      title="Controls"
      :visible.sync="dialogVisible"
      :fullscreen="false"
      :append-to-body="true"
      custom-class="bg-gray-100"
    >
      <div class="flex flex-col space-y-4" v-if="dialogVisible">
        <div>
          <div class="text-lg">Zoom to selected country</div>
          <country-selector-component
            @selected-country="handleCountrySelection"
          />
        </div>

        <div>
          <div class="text-lg">Zoom to selected language</div>
          <el-autocomplete
            class="w-full"
            clearable
            v-model="selectedLanguage"
            :fetch-suggestions="languageSearch"
            placeholder="Please "
            value-key="name"
            @select="handleLanguageSelection"
          ></el-autocomplete>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CountrySelectorComponent from "./CountrySelector.component.vue";
import { EventBus } from "src/main.js";
import bbox from "@turf/bbox";

export default {
  components: {
    CountrySelectorComponent,
  },
  data() {
    return {
      dialogVisible: false,
      selectedLanguage: undefined,
      modalHeight: `${window.innerHeight * 0.8}px`,
    };
  },
  methods: {
    handleCountrySelection(country) {
      if (!country) return;
      let box = this.getBoundingBox(country.geojson);
      EventBus.$emit("zoomToCountry", { country, box });
      this.dialogVisible = false;
    },
    handleLanguageSelection(language) {
      if (!language) return;
      EventBus.$emit("zoomToLanguage", {
        language: language,
        box: this.getBoundingBox(language.geometry),
      });
      this.dialogVisible = false;
    },
    languageSearch(queryString, cb) {
      if (!queryString || queryString.length < 2) {
        cb([]);
        return;
      }
      let re = new RegExp(queryString, "i");
      let matches = this.$store.state.languages
        .filter(l => l.properties.name.match(re))
        .map(l => ({
          name: l.properties.name,
          properties: l.properties,
          geometry: l.geometry,
        }));
      cb(matches);
    },
    getBoundingBox(geojson) {
      let box = bbox(geojson);
      box = [
        [box[0], box[1]],
        [box[2], box[3]],
      ];
      return box;
    },
  },
};
</script>

<style lang="scss" scoped>
.style-language-resources-panel {
  width: 500px;
}
</style>

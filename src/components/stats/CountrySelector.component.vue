<template>
  <div>
    <div>Select a country to view statistics</div>

    <el-select
      class="w-full"
      v-model="selectedCountry"
      clearable
      filterable
      placeholder="Select a country to view statistics"
      @change="loadCountryStatistics"
    >
      <el-option
        v-for="country in countries"
        :key="country.code"
        :label="country.name"
        :value="country.code"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { loadCountryData } from "src/store";
export default {
  data() {
    return {
      selectedCountry: undefined,
    };
  },
  computed: {
    countries: function() {
      return [...this.$store.state.countries];
    },
  },
  methods: {
    async loadCountryStatistics(code) {
      if (!code) {
        this.$emit("selected-country", undefined);
        return;
      }
      let country = await loadCountryData({ code });
      this.$emit("selected-country", country);
    },
  },
};
</script>

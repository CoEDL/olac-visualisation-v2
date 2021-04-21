<template>
  <div class="flex flex-col lg:flex-row">
    <div class="lg:w-1/4 p-4">
      <country-selector-component @selected-country="setSelectedCountry" />
    </div>
    <div class="lg:w-3/4 p-4 h-screen overflow-scroll">
      <display-country-stats-component :country="country" />
    </div>
  </div>
</template>

<script>
import CountrySelectorComponent from "./CountrySelector.component.vue";
import DisplayCountryStatsComponent from "./DisplayCountryStats.component.vue";
export default {
  components: {
    CountrySelectorComponent,
    DisplayCountryStatsComponent,
  },
  data() {
    return {
      selectedCountry: undefined,
      country: undefined,
    };
  },
  computed: {
    countries: function() {
      return [...this.$store.state.countries];
    },
  },
  methods: {
    async setSelectedCountry(data) {
      this.country = data;
    },
  },
};
</script>

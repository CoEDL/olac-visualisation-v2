<template>
  <div class="flex flex-col">
    <div class="text-2xl pl-4 py-6 bg-blue-100 flex flex-row space-x-4">
      <router-link to="/" class="text-yellow-600 hover:underline">
        <i class="fas fa-home"></i>
      </router-link>
      <div class="">
        Browse language resources per country
      </div>
    </div>
    <div class="flex flex-col lg:flex-row">
      <div class="lg:w-1/4 px-4 bg-blue-100">
        <country-selector-component @selected-country="setSelectedCountry" />
      </div>
      <div
        class="lg:w-3/4 p-4 overflow-scroll"
        :style="{ height: panelHeight }"
      >
        <display-country-stats-component :country="country" />
      </div>
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
      panelHeight: `${window.innerHeight - 80}px`,
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

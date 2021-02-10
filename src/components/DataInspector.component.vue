<template>
  <div class="flex flex-col text-gray-700" v-if="selectedLanguage.code">
    <div class="text-base mb-3 border-b border-gray-300">
      Language: {{ selectedLanguage.name }}
    </div>
    <language-summary-component class="text-sm" />
  </div>
</template>

<script>
import LanguageSummaryComponent from "./LanguageSummary.component.vue";
export default {
  components: {
    LanguageSummaryComponent,
  },
  data() {
    return {};
  },
  computed: {
    selectedLanguage() {
      return this.$store.state.selectedLanguage;
    },
  },
};
</script>

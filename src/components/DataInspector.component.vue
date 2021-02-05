<template>
  <div class="flex flex-col text-gray-700" v-if="selectedLanguage.code">
    <div class="text-base my-6 border-b border-gray-300">
      Language: {{ selectedLanguage.name }}
    </div>
    <language-summary-component class="text-sm" />
    <div class="flex flex-row flex-grow justify-center mt-10">
      <browse-language-resources-modal-component />
    </div>
  </div>
</template>

<script>
import BrowseLanguageResourcesModalComponent from "./BrowseLanguageResourcesModal.component.vue";
import LanguageSummaryComponent from "./LanguageSummary.component.vue";
export default {
  components: {
    LanguageSummaryComponent,
    BrowseLanguageResourcesModalComponent,
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

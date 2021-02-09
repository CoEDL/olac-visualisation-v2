<template>
  <div>
    <el-button type="primary" size="small" @click="exploreLanguageResources">
      explore language resources
    </el-button>

    <el-dialog
      title="Explore Language Resources"
      :visible.sync="dialogVisible"
      :fullscreen="true"
      custom-class="bg-gray-100"
      @close="handleClose"
    >
      <div slot="title" class="text-2xl p-4">
        <i class="fas fa-sign-language"></i>
        {{ selectedLanguage.name }}
      </div>

      <div class="flex flex-col text-base space-y-8 py-4 px-8">
        <div>Also known as: {{ otherNamesAndDialects }}</div>
        <language-summary-component class="style-language-resources-panel" />

        <search-language-resources-component v-if="dialogVisible" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LanguageSummaryComponent from "./LanguageSummary.component.vue";
import SearchLanguageResourcesComponent from "./SearchLanguageResources.component.vue";

export default {
  components: {
    LanguageSummaryComponent,
    SearchLanguageResourcesComponent,
  },
  data() {
    return {
      dialogVisible: false,
      modalHeight: `${window.innerHeight * 0.8}px`,
    };
  },
  computed: {
    selectedLanguage() {
      return this.$store.state.selectedLanguage;
    },
    otherNamesAndDialects() {
      return this.selectedLanguage?.otherNamesAndDialects.join(", ");
    },
    types() {
      return Object.keys(this.$store.state.selectedLanguage.summary);
    },
    showLanguageResources() {
      return this.$store.state.showLanguageResources;
    },
  },
  watch: {
    showLanguageResources: function() {
      this.dialogVisible = this.$store.state.showLanguageResources.visible;
    },
  },
  methods: {
    exploreLanguageResources() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.$store.commit("toggleLanguageResources");
    },
  },
};
</script>

<style lang="scss" scoped>
.style-language-resources-panel {
  width: 500px;
}
</style>

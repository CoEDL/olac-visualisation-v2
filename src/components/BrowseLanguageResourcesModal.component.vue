<template>
  <div>
    <el-dialog
      title="Explore Language Resources"
      :visible.sync="dialogVisible"
      :fullscreen="true"
      :append-to-body="true"
      custom-class="bg-gray-100"
      @close="handleClose"
    >
      <div v-if="selectedLanguage">
        <div slot="title" class="text-2xl p-4">
          <i class="fas fa-sign-language"></i>
          {{ selectedLanguage.name }}
        </div>

        <div class="flex flex-col text-base space-y-8 py-4 px-8">
          <div>Also known as: {{ otherNamesAndDialects }}</div>
          <language-summary-component class="style-language-resources-panel" />

          <search-language-resources-component
            v-if="dialogVisible && selectedLanguage.resources"
          />
        </div>
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
      otherNamesAndDialects: "",
      types: [],
    };
  },
  computed: {
    selectedLanguage() {
      return this.$store.state.selectedLanguage;
    },
    showLanguageResources() {
      return this.$store.state.showLanguageResources;
    },
  },
  watch: {
    "selectedLanguage.name": function() {
      if (this.selectedLanguage.name) {
        this.otherNamesAndDialects =
          this.selectedLanguage.otherNamesAndDialects.join(", ") || "";
      }
    },
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

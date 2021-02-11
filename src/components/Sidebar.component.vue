<template>
  <div class="w-64 flex flex-col p-4 space-y-4">
    <div>
      <img :src="logo" />
    </div>
    <div class="flex flex-col text-gray-700 space-y-2">
      <div class="text-xl text-center">OLAC Language Archives</div>
      <div class="text-base text-center">data visualisation</div>
    </div>
    <about-component />
    <legend-component class="p-6 border border-gray-200 text-xs xl:text-base" />
    <data-inspector-component class="hidden xl:block" />
    <browse-language-resources-modal-component />
  </div>
</template>

<script>
import LegendComponent from "./Legend.component.vue";
import AboutComponent from "./About.component.vue";
import DataInspectorComponent from "./DataInspector.component.vue";
import BrowseLanguageResourcesModalComponent from "./BrowseLanguageResourcesModal.component.vue";
const logo = require("@/assets/logo.png");

export default {
  components: {
    AboutComponent,
    LegendComponent,
    DataInspectorComponent,
    BrowseLanguageResourcesModalComponent,
  },
  data() {
    return {
      logo,
    };
  },
};
</script>

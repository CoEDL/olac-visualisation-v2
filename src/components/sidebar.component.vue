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
  </div>
</template>

<script>
import AboutComponent from "./About.component.vue";
const logo = require("@/assets/logo.png");
export default {
  components: {
    AboutComponent,
  },
  data() {
    return {
      logo,
    };
  },
};
</script>

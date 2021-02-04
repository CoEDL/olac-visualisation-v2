<template>
  <div class="w-full flex flex-row p-4 space-x-2">
    <div>
      <img :src="logo" class="h-10" />
    </div>
    <div class="text-gray-700 pt-1 md:pt-2 text-xs md:test-base">
      OLAC Language Archives data visualisation
    </div>
  </div>
</template>

<script>
const logo = require("@/assets/logo.png");
export default {
  data() {
    return {
      logo,
    };
  },
};
</script>

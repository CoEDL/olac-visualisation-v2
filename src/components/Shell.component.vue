<template>
  <div class="text-4xl">
    <map-component />
  </div>
</template>

<script>
import MapComponent from "./Map.component.vue";
export default {
  components: {
    MapComponent,
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.dispatch("loadData");
  },
};
</script>

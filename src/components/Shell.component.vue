<template>
  <div class="text-4xl">
    main shell
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.$store.dispatch("loadData");
  },
};
</script>

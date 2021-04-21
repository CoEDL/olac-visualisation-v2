<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.dispatch("loadData");
  },
};
</script>

<style lang="scss"></style>

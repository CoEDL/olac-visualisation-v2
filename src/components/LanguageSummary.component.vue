<template>
  <div v-if="summary.length">
    <div v-for="(s, idx) of summary" :key="idx" class="flex flex-row">
      <div class="flex-grow mr-1">{{ s.key }}</div>
      <div>{{ s.count }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    summary() {
      let language = this.$store.state.selectedLanguage;
      let summary = [];
      if (language.code) {
        summary = Object.keys(language.summary).map(key => ({
          key,
          count: language.summary[key],
        }));
      }
      return summary;
    },
  },
};
</script>

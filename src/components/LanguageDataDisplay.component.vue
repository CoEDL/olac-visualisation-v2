<template>
  <div
    class="bg-gray-100 border-gray-400 border rounded p-6 text-gray-700 text-center"
  >
    <div class="text-xl underline cursor-pointer" @click="browseLanguageData">
      {{ language.name }}
    </div>
    <div class="text-base">{{ language.total }} resources</div>
  </div>
</template>

<script>
export default {
  props: {
    language: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    browseLanguageData() {
      this.$store.commit("toggleLanguageResources");
    },
  },
};
</script>

<template>
  <div>
    <li v-if="summary[type]" class="ml-4 list-disc">
      {{ type }}: {{ summary[type] }}
    </li>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    summary: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

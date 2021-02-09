<template>
  <div class="flex flex-col space-y-2">
    <div class="flex flex-row space-x-4">
      <div
        class="rounded-full h-6 w-6"
        :style="{ 'background-color': resourceSteps[scheme][0].color }"
      ></div>
      <div class="-mt-1">< {{ resourceSteps[scheme][0].count }} resources</div>
    </div>
    <div class="flex flex-row space-x-4">
      <div
        class="rounded-full h-6 w-6"
        :style="{ 'background-color': resourceSteps[scheme][1].color }"
      ></div>
      <div class="-mt-1">
        {{ resourceSteps[scheme][0].count }} < resources <
        {{ resourceSteps[scheme][1].count }}
      </div>
    </div>
    <div class="flex flex-row space-x-4">
      <div
        class="rounded-full h-6 w-6"
        :style="{ 'background-color': resourceSteps[scheme][2].color }"
      ></div>
      <div class="-mt-1">
        {{ resourceSteps[scheme][1].count }} < resources <
        {{ resourceSteps[scheme][2].count }}
      </div>
    </div>
    <div class="flex flex-row space-x-4">
      <div
        class="rounded-full h-6 w-6"
        :style="{ 'background-color': resourceSteps[scheme][3].color }"
      ></div>
      <div class="-mt-1">> {{ resourceSteps[scheme][3].count }} resources</div>
    </div>

    <div class="underline text-xs cursor-pointer" @click="changeColourScheme">
      change colour scheme
    </div>
  </div>
</template>

<script>
import { resourceSteps } from "../configuration";

export default {
  data() {
    return {
      resourceSteps,
    };
  },
  computed: {
    scheme() {
      return this.$store.state.colorScheme.scheme;
    },
  },
  methods: {
    changeColourScheme() {
      if (this.$store.state.colorScheme.scheme === "normal") {
        this.$store.commit("setColorScheme", { scheme: "blue" });
      } else {
        this.$store.commit("setColorScheme", { scheme: "normal" });
      }
    },
  },
};
</script>

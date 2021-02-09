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

    <div class="flex flex-row space-x-2 mt-2">
      <div class="text-sm">
        Colour:
      </div>
      <div
        class="h-6 w-6 rounded-full cursor-pointer"
        :style="{ background: color.default }"
        @click="changeColourScheme('default')"
      ></div>
      <div
        class="h-6 w-6 rounded-full cursor-pointer"
        :style="{ background: color.blue }"
        @click="changeColourScheme('blue')"
      ></div>
      <div
        class="h-6 w-6 rounded-full cursor-pointer"
        :style="{ background: color.purple }"
        @click="changeColourScheme('purple')"
      ></div>
      <div
        class="h-6 w-6 rounded-full cursor-pointer"
        :style="{ background: color.orange }"
        @click="changeColourScheme('orange')"
      ></div>
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
    color() {
      let schemes = Object.keys(resourceSteps);
      let colors = {};
      schemes.forEach(scheme => {
        colors[
          scheme
        ] = `linear-gradient(to right, ${resourceSteps[scheme][1].color}, ${resourceSteps[scheme][2].color}, ${resourceSteps[scheme][3].color})`;
      });
      return colors;
    },
  },
  methods: {
    changeColourScheme(scheme) {
      switch (scheme) {
        case "default":
          this.$store.commit("setColorScheme", { scheme: "default" });
          break;
        case "blue":
          this.$store.commit("setColorScheme", { scheme: "blue" });
          break;
        case "purple":
          this.$store.commit("setColorScheme", { scheme: "purple" });
          break;
        case "orange":
          this.$store.commit("setColorScheme", { scheme: "orange" });
          break;
      }
    },
  },
};
</script>

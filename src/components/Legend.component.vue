<template>
  <div class="flex flex-col space-y-2">
    <div class="flex flex-row space-x-4">
      <div
        class="rounded-full h-6 w-6"
        :style="{ 'background-color': resourceSteps[0].color }"
      ></div>
      <div class="-mt-1">< {{ resourceSteps[0].count }} resources</div>
    </div>
    <div class="flex flex-row space-x-4">
      <div
        class="rounded-full h-6 w-6"
        :style="{ 'background-color': resourceSteps[1].color }"
      ></div>
      <div class="-mt-1">
        {{ resourceSteps[0].count }} < resources < {{ resourceSteps[1].count }}
      </div>
    </div>
    <div class="flex flex-row space-x-4">
      <div
        class="rounded-full h-6 w-6"
        :style="{ 'background-color': resourceSteps[2].color }"
      ></div>
      <div class="-mt-1">> {{ resourceSteps[1].count }} resources</div>
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
};
</script>

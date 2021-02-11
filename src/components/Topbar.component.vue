<template>
  <div>
    <div class="w-full flex flex-row p-4 space-x-2">
      <div>
        <img :src="logo" class="h-10" />
      </div>
      <div class="text-gray-700 pt-1 md:pt-2 text-xs md:text-base">
        OLAC Language Archives data visualisation
      </div>
      <div class="flex-grow"></div>
      <div>
        <el-button size="small" @click="dialogVisible = !dialogVisible"
          >About</el-button
        >
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="true"
      :append-to-body="true"
    >
      <div slot="title">
        <div class="w-full flex flex-colp-4 space-x-2">
          <div>
            <img :src="logo" class="h-10" />
          </div>
          <div class="text-gray-700 pt-1 md:pt-2 text-xs md:text-base">
            OLAC Language Archives data visualisation
          </div>
        </div>
      </div>

      <div class="flex flex-col space-y-4">
        <about-component />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AboutComponent from "./About.component.vue";
const logo = require("@/assets/logo.png");

export default {
  components: {
    AboutComponent,
  },
  data() {
    return {
      logo,
      dialogVisible: false,
    };
  },
};
</script>

<template>
  <div class="flex flex-col lg:flex-row h-full">
    <topbar-component class="block lg:hidden" />
    <sidebar-component class="hidden lg:block w-1/3 lg:w-1/4 h-full" />
    <map-component class="hidden md:block w-2/3 lg:w-3/4" />
  </div>
</template>

<script>
import MapComponent from "./Map.component.vue";
import TopbarComponent from "./topbar.component.vue";
import SidebarComponent from "./sidebar.component.vue";
export default {
  components: {
    TopbarComponent,
    SidebarComponent,
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

<template>
  <div class="flex flex-col lg:flex-row h-full">
    <topbar-component class="block lg:hidden" />
    <sidebar-component class="hidden lg:block w-2/5 lg:w-1/4 h-full" />
    <map-component class="hidden md:block flex-grow" />
    <legend-component
      class="block lg:hidden fixed bottom-10 left-1 p-2 rounded text-xs xl:text-base bg-gray-100"
    />

    <div class="block md:hidden mt-4 text-center text-sm">
      Unfortunately, a phone is just too small for this site!
    </div>
  </div>
</template>

<script>
import LegendComponent from "./Legend.component.vue";
import MapComponent from "./Map.component.vue";
import TopbarComponent from "./Topbar.component.vue";
import SidebarComponent from "./Sidebar.component.vue";
export default {
  components: {
    TopbarComponent,
    SidebarComponent,
    MapComponent,
    LegendComponent,
  },
  data() {
    return {};
  },
};
</script>

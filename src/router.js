import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import ShellComponent from "./components/Shell.component.vue";
import StatsShellComponent from "./components/stats/Shell.component.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: ShellComponent,
  },
  {
    path: "/stats",
    name: "Stats",
    component: StatsShellComponent,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.NODE_ENV === "production" ? "/olacvis/" : "/",
  routes,
});

export default router;

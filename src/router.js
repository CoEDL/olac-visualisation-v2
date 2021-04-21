import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import ShellComponent from "./components/Shell.component.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: ShellComponent,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.NODE_ENV === "production" ? "/olacvis/" : "/",
  routes,
});

export default router;

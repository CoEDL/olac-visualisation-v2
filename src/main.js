import "./assets/styles.scss";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import fontawesome from "@fortawesome/fontawesome-free/js/all";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoReplaceSvg = "nest";

import KeenUI from "keen-ui";
import "keen-ui/dist/keen-ui.css";

Vue.use(KeenUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");

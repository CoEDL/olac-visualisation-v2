import "element-ui/lib/theme-chalk/index.css";
import "./assets/styles.scss";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import fontawesome from "@fortawesome/fontawesome-free/js/all";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoReplaceSvg = "nest";

import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");

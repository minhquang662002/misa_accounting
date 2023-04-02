import { createApp } from "vue";
import App from "./App.vue";
// import { VueI18n } from "vue-i18n";
import { clickOutside } from "./directives";
import router from "./router";
import store from "./store";
import BaseButton from "./components/base/BaseButton";
import BaseTextField from "./components/base/BaseTextField";
import BaseDropDownList from "./components/base/BaseDropDownList";
import BaseToolTip from "./components/base/BaseToolTip";
import BaseToast from "./components/base/BaseToast";
import BaseDialog from "./components/base/BaseDialog";

createApp(App)
  .component("BaseButton", BaseButton)
  .component("BaseTextField", BaseTextField)
  .component("BaseDropDownList", BaseDropDownList)
  .component("BaseToolTip", BaseToolTip)
  .component("BaseToast", BaseToast)
  .component("BaseDialog", BaseDialog)
  .directive("click-outside", clickOutside)
  .use(store)
  .use(router)
  // .use(VueI18n)
  .mount("#app");

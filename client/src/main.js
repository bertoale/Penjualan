import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./routers/index.js";
import "flowbite";
createApp(App).use(router).mount("#app");

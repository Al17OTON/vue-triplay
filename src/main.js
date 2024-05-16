import "./assets/css/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Swal from "sweetalert2"; //alert 창 이쁘게 띄우기

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

<script setup>
import { RouterLink, RouterView } from "vue-router";
// import VHeader from "./components/common/VHeader.vue";
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
</script>

<template>
  <header class="header-wrap">
    <Header />
  </header>

  <RouterView />

  <footer>
    <Footer />
  </footer>
</template>

<style scoped>
.header-wrap {
  /* padding-bottom: 2%; */
  margin-bottom: 10%; /*해결필요*/
}

.footer-wrap {
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  
}
</style>

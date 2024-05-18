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
  margin-bottom: 5%; /*해결필요*/
}
</style>

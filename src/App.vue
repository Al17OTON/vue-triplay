<script setup>
import { RouterLink, RouterView } from "vue-router";
// import VHeader from "./components/common/VHeader.vue";
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";

</script>

<template>
  <header>
    <Header />
  </header>

  <RouterView />

  <footer>
    <Footer />
  </footer>
</template>

<style scoped></style>

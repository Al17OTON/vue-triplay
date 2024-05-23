<script setup>
import { RouterLink, RouterView } from "vue-router";
// import VHeader from "./components/common/VHeader.vue";
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
</script>

<template>
  <div>
    <header class="header-wrap">
      <Header />
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <Footer />
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header-wrap {
  margin-bottom: 5%;
}

.main-content {
  flex: 1;
}

.footer-wrap {
  text-align: center;
}
</style>

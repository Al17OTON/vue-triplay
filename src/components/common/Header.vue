<script setup>
import { login, logout } from "@/util/login.js";
import { useMemberStore } from "@/stores/memberStore.js";

const memberStore = useMemberStore();

const callLogin = () => {
  login();
};
const callLogout = () => {
  logout();
};
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-sm bg-light navbar-light shadow fixed-top">
      <div class="container-sm">
        <RouterLink class="navbar-brand" to="/"
          ><span
            style="
              font-weight: bold;
              color: #23b83a;
              font-size: 30px;
              font-family: 'SokchoBadaDotum', sans-serif;
            "
            >TriPlay</span
          ></RouterLink
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
          <ul class="navbar-nav">
            <div v-if="memberStore.member_id" class="nav-section">
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'game' }">게임</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'plan' }">여행 계획</RouterLink>
              </li>
              <li class="nav-item">
                <a id="logoutLink" class="nav-link" @click.prevent="callLogout">로그아웃</a>
              </li>
              <li class="nav-item">
                <!-- <a id="myPageLink" class="nav-link" @click.prevent="">마이페이지</a> -->
                <RouterLink id="myPageLink" class="nav-link" :to="{ name: 'mypage' }"
                  >마이페이지</RouterLink
                >
              </li>
            </div>

            <div v-else class="nav-section">
              <li class="nav-item">
                <a id="loginLink" class="nav-link" @click.prevent="callLogin">로그인</a>
              </li>
              <li class="nav-item">
                <RouterLink id="signLink" class="nav-link" :to="{ name: 'signup' }"
                  >회원가입</RouterLink
                >
              </li>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.nav-section {
  display: flex;
  align-items: row;
}

#loginLink:hover {
  cursor: pointer;
}
</style>

<script setup>
import { useMemberStore } from "@/stores/memberStore";
import Swal from "sweetalert2";
import { Axios } from "@/util/http-commons.js";

const memberStore = useMemberStore();
const api = Axios();

const login = () => {
  Swal.fire({
    title: "로그인",

    html:
    '<input id="swal-input1" class="swal2-input" placeholder="ID">' +
    '<input id="swal-input2" class="swal2-input" placeholder="PassWord">',

    inputAttributes: {
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "login",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        api.post("login", {
          member_id: id,
          member_pw: password
        })
        .then((res) => console.log(res));
        
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `${result.value.login}'s avatar`,
        imageUrl: result.value.avatar_url
      });
    }
  });
}

</script>

<template>
  <div>
    <nav class="navbar navbar-expand-sm bg-light navbar-light shadow fixed-top">
      <div class="container-sm">
        <RouterLink class="navbar-brand" to="/">Enjoy Trip</RouterLink>
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
                <RouterLink class="nav-link" :to="{ name: 'main' }">지역별 여행지</RouterLink>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="">여행 계획</a>
              </li>
              <li class="nav-item">
                <RouterLink id="boardLink" class="nav-link" :to="{ name: 'main' }"
                  >게시판</RouterLink
                >
              </li>
              <li class="nav-item">
                <a id="logoutLink" class="nav-link" href="">로그아웃</a>
              </li>
              <li class="nav-item">
                <a id="myPageLink" class="nav-link" href="">마이페이지</a>
              </li>
            </div>
            
            <div v-else class="nav-section">
              <li class="nav-item">    
                <a id="loginLink" class="nav-link" @click.prevent="login">로그인</a>
              </li>
              <li class="nav-item">
                <RouterLink id="signLink" class="nav-link" to="/signup">회원가입</RouterLink>
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

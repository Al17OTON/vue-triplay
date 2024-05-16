<script setup>
import { useMemberStore } from "@/stores/memberStore";
import Swal from "sweetalert2";
import { Axios } from "@/util/http-commons.js";
import { ref } from "vue";

const memberStore = useMemberStore();
const api = Axios();

const login = () => {
 
  (async () => {

    const res = await Swal.fire({
      title: "로그인",

      html:
      '<input id="swal-input1" class="swal2-input" placeholder="ID">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Password">',

      inputAttributes: {
        autocapitalize: "off",
        input: 'text',
        required: 'true'
      },
      showCancelButton: true,
      confirmButtonText: "login",
      showLoaderOnConfirm: true,
      
      preConfirm: async () => {
        const id = document.getElementById('swal-input1').value;
        const pw = document.getElementById('swal-input2').value;
        
        if(!id || !pw) Swal.showValidationMessage("아이디와 비밀번호를 모두 입력해주세요.");     
        
          const response = await api.post("member/login", {
              member_id : id,
              member_pw : pw
          }).then(res => res.json());
          // if(!response.ok) {
          //   return Swal.showValidationMessage("로그인 정보가 올바르지 않습니다."); 
          // }
          return response;
      }
    });

    
  })();
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

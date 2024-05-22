<script setup>
import { ref, onMounted } from "vue";
import { Axios } from "@/util/http-commons.js";
import Swal from "sweetalert2";
import Result from "@/components/common/Result.vue";
import { oops } from "@/util/sweetAlert.js";
import { useMemberStore } from "@/stores/memberStore.js";

const api = Axios();
const memberStore = useMemberStore();
const id = ref("");
const pw = ref("");
const email = ref("");
const name = ref("");
const modifySuccess = ref(false);

const isEmail = ref(true);
const isPw = ref(true);
const isId = ref(true);

onMounted(() => {
    api.get("/member/getMember?member_id=" + memberStore.member_id, {
        headers : {
            access_token: memberStore.token
        }
    }).then((res) => {
        if(res.status === 200) {
            id.value = res.data.resdata.member_id;
            email.value = res.data.resdata.member_email;
            name.value = res.data.resdata.member_name;
        } else {
            oops("회원 정보를 불러오는데 문제가 생겼습니다.");
        }
    })
})

const modify = () => {

  if (!isEmail || !isPw || !isId) {
    alert("비밀번호, 아이디 혹은 이메일이 잘못되었습니다")
    return; //todo : 알림띄우기
  } 
    api.put("/member/modify", {
      member_id: memberStore.member_id,
      member_pw: pw.value,
      member_email: email.value,
      member_name: name.value
    }, {
        headers : {
            access_token : memberStore.token
        }
    })
    .then(res => {
        console.log(res);
      if (res.status === 200) modifySuccess.value = true;
      else {
        oops("회원 정보 수정에 문제가 생겼습니다.");
      }
    });
}

const checkEmail = () => {
  // 이메일 형식 검사
  const validateEmail = /^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-Za-z0-9\\-]+/;

  if (validateEmail.test(email.value) || !email.value) {
    isEmail.value = true;
    return;
  }
  isEmail.value = false;
}

const checkPw = () => {
  isPw.value = true;  //편의를 위해서 임시로 막음
  return;
  // 비밀번호 형식 검사
  const validatePassword = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

  if (validatePassword.test(pw.value) ||!pw.value) {
    isPw.value = true;
    return;
  }
  isPw.value = false;
}

</script>


<template>
  <div>
    <div v-show="!modifySuccess" class="container" style="width: 450px">
      <h2 class="fw-bold">회원정보 수정</h2>
      <form @submit.prevent="modify">
        <div class="form-group">
          <label for="username">아이디</label>
          <input v-model="id" type="text" id="username" name="username" readonly>
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input @input="checkPw" v-model="pw" type="password" id="password" name="password" required>
          <span v-show="!isPw">비밀번호 형식이 잘못되었습니다.</span>
        </div>
        <div class="form-group">
          <label for="name">이름</label>
          <input v-model="name" type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input @input="checkEmail" v-model="email" type="email" id="email" name="email" required>
          <span v-show="!isEmail">이메일 형식이 잘못되었습니다.</span>
        </div>
        <button type="submit" class="btn-submit">수정하기</button>
      </form>
    </div>

    <Result v-show="modifySuccess" msg="회원정보 수정 완료" to="mypage" toName="확인"/>
  </div>
</template>

<style scoped>

.container {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 300px;
  }

  .container h2 {
    margin-bottom: 20px;
    text-align: center;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
  }

  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .btn-submit {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    display: block;
  }

  .btn-submit:hover {
    background-color: #0056b3;
  }
</style>

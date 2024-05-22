<script setup>
import { Axios } from "@/util/http-commons.js";
import { useMemberStore } from "@/stores/memberStore.js";
import { ref, onMounted } from "vue";

const emit = defineEmits(["needPassword"]);
const api = Axios();
const memberStore = useMemberStore();
const info = ref({
  member_name: "",
  member_email: "",
  member_id: "",
  score: 0,
});
const min = ref(0);
const max = ref(0);
const styleWidth = ref();
const bigImg = ref();
const smallImg = ref();
const grade = ref();

const getInfo = () => {
  api
    .get("/member/getMember?member_id=" + memberStore.member_id, {
      headers: {
        access_token: `${memberStore.token}`,
      },
    })
    .then((res) => {
      info.value = res.data.resdata;
      info.value.member_register_time = info.value.member_register_time.slice(0, 10);
      // 점수에 따라 등급 및 최소/최대값 정해주기

      if (info.value.score <= 20000) {
        min.value = 0;
        max.value = 20000;
        grade.value = "sprout";
      } else if (info.value.score <= 40000) {
        min.value = 20001;
        max.value = 40000;
        grade.value = "bronze";
      } else if (info.value.score <= 60000) {
        min.value = 40001;
        max.value = 60000;
        grade.value = "silver";
      } else {
        min.value = 60001;
        max.value = 100000;
        grade.value = "gold";
      }
      bigImg.value = `/src/assets/img/icn/icn_${grade.value}2.png`;
      smallImg.value = `/src/assets/img/icn/icn_${grade.value}.png`;
      styleWidth.value = ((info.value.score - min.value) * 100) / min.value;
    });
};

const addCommasToNumberString = (number) => {
  if (typeof number !== "string") {
    number = number.toString();
  }
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

onMounted(() => {
  getInfo();
});

const remove = () => {
  emit("needPassword", "remove");
};
const modify = () => {
  emit("needPassword", "modify");
};
</script>

<template>
  <div>
    <div class="container">
      <div class="row justify-content-md-center">
        <!-- 중앙 left content  start -->
        <div class="col-lg-4">
          <div class="card mb-3 card-shadow">
            <div id="info_left" class="card-body d-flex flex-column align-items-center">
              <p id="info_left_name" class="card-title text-white mt-5 fw-bold fs-1">
                {{ info.member_name }}
              </p>
              <p id="info_left_email" class="card-text text-white mt-3 mb-5 fs-5">
                {{ info.member_email }}
              </p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item p-5 fs-5">
                <div class="mb-4">
                  아이디
                  <div class="info">{{ info.member_id }}</div>
                </div>
                <div class="mb-4">
                  등급
                  <img class="info" :src="smallImg" />
                  <div class="info me-2">{{ grade }}</div>
                </div>
                <div>
                  가입일
                  <div class="info">{{ info.member_register_time }}</div>
                </div>
              </li>
              <li class="list-group-item p-5 fs-5">
                <a @click="modify" class="mb-4 clickable">회원 정보 수정</a>
                <a @click="remove" class="clickable">회원 탈퇴</a>
              </li>
            </ul>
          </div>
        </div>
        <!-- 중앙 left content end -->
        <!-- 중앙 center content start -->
        <div class="col-lg-6">
          <div class="card card-shadow">
            <div class="card-header text-white p-3 fs-5 d-flex justify-content-between">등급</div>
            <div class="card-body p-3">
              <img :src="bigImg" alt="" />
              <span class="info-score">{{ addCommasToNumberString(info.score) }} </span
              ><span style="font-size: 18px">point</span>
              <div class="progress mt-3">
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                  role="progressbar"
                  :aria-valuenow="info.score"
                  :aria-valuemin="min"
                  :aria-valuemax="max"
                  :style="{ width: styleWidth + '%' }"
                ></div>
              </div>
              <div class="mt-2">
                {{ addCommasToNumberString(min) }}
                <div style="float: right">{{ addCommasToNumberString(max) }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 중앙 center content end -->
      </div>
    </div>
  </div>
</template>

<style scoped>
#info_left {
  background-image: url("/src/assets/img/place4.jpg");
  background-size: cover;
  border-radius: 5px 5px 0px 0px;
}

.card-shadow {
  /* x-pos y-pos blur spread color*/
  box-shadow: 3px 3px 10px 3px #cfcfcf;
}

.card-header {
  color: white;
  background-image: linear-gradient(to right, #30af1c, #207d20);
}

.clickable {
  cursor: pointer;
  display: block;
  text-decoration: none;
  color: black;
}

.info {
  font-weight: bold;
  float: right;
}

.info-score {
  font-size: 25px;
  font-weight: bold;
  margin: 0 10px;
}
</style>

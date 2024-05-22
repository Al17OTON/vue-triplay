<script setup>
import { useMemberStore } from "@/stores/memberStore.js";
import { Axios } from "@/util/http-commons.js";
import { onMounted, ref } from "vue";

const api = Axios();
const memberStore = useMemberStore();
const leaderBoard = ref([]);
const url = "/member/leaderBoard";

const getLeaderBoardList = async () => {
  await api.get(url).then((res) => (leaderBoard.value = res.data.resdata));
};
const getMyLeaderBoard = () => {
  api
    .get(url + `/${memberStore.member_id}`)
    .then((res) => leaderBoard.value.push(res.data.resdata));
};

//로그인 되어있고 리더보드에 자신이 포함되어 있지 않다면 서버에서 자신의 순위 정보 가져오기
onMounted(async () => {
  await getLeaderBoardList(); //결과 받을때까지 대기

  if (memberStore.isLogin) {
    for (var i = 0; i < leaderBoard.value.length; i++) {
      if (leaderBoard.value[i].member_id === memberStore.member_id) {
        return;
      }
    }
    getMyLeaderBoard();
  }
});
</script>

<template>
  <h2 class="title m-3 p-2" style="text-align: center">순위표🏆</h2>
  <hr style="width: 70%; margin: 0 auto; border: none; height: 2px; background-color: #ccc" />
  <div class="mt-3" style="text-align: center; font-size: 20px">
    순위표를 확인하고 더 높은 점수를 향해 도전해보세요!
  </div>
  <div class="leaderboard">
    <!-- <div class="leaderboard-header">
      <h2 class="title" style="text-align: center">순위표</h2>
    </div> -->
    <ul class="leaderboard-list">
      <li class="leaderboard-item">
        <span class="rank">순위</span>
        <span class="username">ID</span>
        <span class="score">점수</span>
      </li>
      <li v-for="leader in leaderBoard" :key="leader.member_id" class="leaderboard-item">
        <span class="rank">{{ leader.rank }}</span>
        <span class="username">{{ leader.member_id }}</span>
        <span class="score">{{ leader.score }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/**chatGPT에게 부탁한 간단한 리더보드 디자인 */
.leaderboard {
  max-width: 400px;
  margin: 20px auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.leaderboard-header {
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.leaderboard-header h2 {
  margin: 0;
  font-size: 24px;
}
.leaderboard-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.leaderboard-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}
.leaderboard-item:nth-child(even) {
  background-color: #f9f9f9;
}
.leaderboard-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}
.leaderboard-item .rank {
  font-size: 20px;
  font-weight: bold;
  margin-right: 15px;
}
.leaderboard-item .username {
  flex-grow: 1;
}
.leaderboard-item .score {
  font-weight: bold;
}
</style>

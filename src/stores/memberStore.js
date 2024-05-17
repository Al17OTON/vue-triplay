import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useMemberStore = defineStore("member", () => {
  const member_id = ref("");
  const token = ref("");

  const logout = () => {
    member_id.value = "";
    token.value = "";
  }
  const isLogin = computed(() => token.value === "" ? false : true);

  return {
    member_id,
    token,

    isLogin,
    logout,
  };
},{persist: true});

import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", () => {
  const member_id = ref("");
  const token = ref("");

  return { member_id, token };
});

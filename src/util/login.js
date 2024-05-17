import { useMemberStore } from "@/stores/memberStore";
import Swal from "sweetalert2";
import { Axios } from "@/util/http-commons.js";

export const login = async () => {
  
  const memberStore = useMemberStore(); 
  const api = Axios();
    const res = await Swal.fire({
      title: "로그인",

      html:
      '<input id="swal-input1" class="swal2-input" placeholder="ID">' +
      '<input type="password" id="swal-input2" class="swal2-input" placeholder="Password">',

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
        
        if (!id || !pw) {
          return Swal.showValidationMessage("아이디와 비밀번호를 모두 입력해주세요.");
        }
        const response = await api.post("member/login", {
            member_id : id,
            member_pw : pw
        }).then(res => {
          console.log("time = " + Date.now());
          return res;
        }).catch(err => {
          console.log(err);
          return err;
        })
        if(response.status != 200) {
          return Swal.showValidationMessage("로그인 정보가 올바르지 않습니다."); 
        }
        console.log(response);

        memberStore.token = response.data.access_token;
        memberStore.member_id = id;

        return true;
      }
    });
}


export const logout = () => {  
  const memberStore = useMemberStore();
  memberStore.logout();
}
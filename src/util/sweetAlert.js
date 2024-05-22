import Swal from "sweetalert2";

export const oops = (msg) => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: msg,
    });
}

export const loading = (msg) => {
    Swal.fire ({
        title: msg,
    })
}

const Toast = Swal.mixin({
  toast: true,
    //   position: "top-end",
    // position: "bottom-end",
    position: "bottom-right",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
//   didOpen: (toast) => {
//     toast.onmouseenter = Swal.stopTimer;
//     toast.onmouseleave = Swal.resumeTimer;
//   }
});

//icon = ('info', 'success', 'error', 'warning', 'question')
export const mixinToast = (msg, icon) => {
    Toast.fire({
        icon: icon,
        title: msg
    });
}
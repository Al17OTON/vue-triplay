import Swal from "sweetalert2";

export const oops = (msg) => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        html: msg,
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
    position: "bottom-end",
    // position: "bottom",
    // position: "bottom-right",
    // position: "top",
    // position: "top-right",

    padding: "2em",
    width: '30%',
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

export const dragInfo = () => {
    Swal.fire({
        title: "드래그해서 이동하세요!",
        imageUrl: '/src/assets/img/info/drag.gif',
        imageWidth: 400,
        imageHeight: 200,
    });
}
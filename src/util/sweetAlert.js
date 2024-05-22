import Swal from "sweetalert2";

export const oops = (msg) => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: msg,
    });
}

export const loading = (msg) => {
    Swal.fire({
                title: 'Please Wait !',
                html:  msg,// add html attribute if you want or remove
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                },
    });
}
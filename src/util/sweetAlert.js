import Swal from "sweetalert2";

export const oops = (msg) => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: msg,
    });
}
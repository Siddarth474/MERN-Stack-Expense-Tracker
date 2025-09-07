import { toast } from "react-toastify";

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'top-right',
        style: { 
            background: "#dcfce7", // green background
            color: "#4caf50",         // text color
        },
    });
}

export const handleFailure = (msg) => {
    toast.error(msg, {
        position: 'top-right',
         style: {
            background: "#ffe2e2", // red background
            color: "#f44336",
        },
    });
}

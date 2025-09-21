import toast from 'react-hot-toast';

export const handleSuccess = (msg) => {
    toast.success(msg, {
        style: { 
            background: "#dcfce7", 
            color: "#4caf50",
        },
    });
}

export const handleFailure = (msg) => {
    toast.error(msg, {
         style: {
            background: "#ffe2e2",
            color: "#f44336",
        },
    });
}

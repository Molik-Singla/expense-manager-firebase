import { toast } from "react-toastify";
import { Zoom } from "react-toastify";

const options = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Zoom,
};

export const notifySuccess = (message = "Work done Successfully !!") => {
    toast.success(message, { ...options });
};
export const notifyError = (message = "Something went Wrong !!") => {
    toast.error(message, { ...options });
};
export const notifyWarr = (message = "Warning for you !!") => {
    toast.warn(message, { ...options });
};

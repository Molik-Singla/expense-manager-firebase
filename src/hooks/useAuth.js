import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth";
import { firebaseAuth, googleProvider } from "../config/firebase";
import { notifyError } from "../animations/Toastify";

const handleErrors = (err) => {
    const errorMapping = {
        // Authentication Errors
        "auth/user-not-found": "User not found. Please check your credentials.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/email-already-in-use": "The email address is already in use by another account.",
        "auth/invalid-email": "The email address is not valid.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/user-token-expired": "The user token has expired. Please log in again.",
        "auth/weak-password": "Password should be at least 6 characters long.",
        "auth/invalid-login-credentials": "Invalid login credentials. Please try again.",
    };

    if (err?.code in errorMapping) return notifyError(errorMapping[err?.code]);
    return notifyError(err.message || "Something went wrong");
};

const useAuth = () => {
    const [loginLoading, setLoginLoading] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);

    const executeOnAfter = (onAfter, data = null) => onAfter && onAfter(data);
    const executeOnBefore = (onBefore) => onBefore && onBefore();

    const apiSignupWithEmailPassword = async ({ ...takeReqParameter }, email, password) => {
        try {
            setSignupLoading(true);
            executeOnBefore(takeReqParameter?.onBefore);
            const response = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const { user } = response;
            const token = await user?.getIdToken();
            const data = {
                user,
                token,
            };
            setSignupLoading(false);
            executeOnAfter(takeReqParameter?.onAfter, data);
        } catch (error) {
            handleErrors(error);
        } finally {
            setSignupLoading(false);
        }
    };
    const apiLoginWithEmailPassword = async ({ ...takeReqParameter }, email, password) => {
        try {
            setLoginLoading(true);
            executeOnBefore(takeReqParameter?.onBefore);
            const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
            const { user } = response;
            const token = await user?.getIdToken();
            const data = {
                user,
                token,
            };
            setLoginLoading(false);
            executeOnAfter(takeReqParameter?.onAfter, data);
        } catch (error) {
            handleErrors(error);
        } finally {
            setLoginLoading(false);
        }
    };

    const apiLoginWithGoogle = async ({ ...takeReqParameter }) => {
        try {
            executeOnBefore(takeReqParameter?.onBefore);
            const response = await signInWithPopup(firebaseAuth, googleProvider);
            const { user } = response;
            const token = await user?.getIdToken();
            const data = {
                user,
                token,
            };
            executeOnAfter(takeReqParameter?.onAfter, data);
        } catch (error) {
            handleErrors(error);
        }
    };
    const apiLogout = async ({ ...takeReqParameter }) => {
        try {
            executeOnBefore(takeReqParameter?.onBefore);
            await signOut(firebaseAuth);
            executeOnAfter(takeReqParameter?.onAfter);
        } catch (error) {
            handleErrors(error);
        }
    };

    return { apiSignupWithEmailPassword, apiLoginWithEmailPassword, apiLoginWithGoogle, apiLogout, loginLoading, signupLoading };
};

export default useAuth;

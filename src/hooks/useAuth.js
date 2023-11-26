import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth";
import { firebaseAuth, googleProvider } from "../config/firebase";
import { notifyError } from "../animations/Toastify";

const handleErrors = (err) => notifyError(err.message || "Something went wrong");

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

// DOCS =>
// 1. We have loading for login , signup
// 2. We can provide onBefore and onAfter for each api
// 3. onAfter have access to data ( here it is token & user data ) ( If there is any )
// 4. We can loginUser with email and password , signupUser with email and password , login with google , logoutUser
// 5. We handle some errors and display ( using react-toastify ) custom messages according to error code of firebase
// 6. You can use 4 API Functions and 2 Loading States

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

    const extractUser = (user) => {
        return {
            uid: user?.uid,
            email: user?.email,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
        };
    };

    const apiSignupWithEmailPassword = async ({ ...takeReqParameter }, email, password) => {
        try {
            setSignupLoading(true);
            executeOnBefore(takeReqParameter?.onBefore);
            const response = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const { user } = response;
            const token = await user?.getIdToken();
            const data = {
                user: extractUser(user),
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

            setLoginLoading(false);

            executeOnAfter(takeReqParameter?.onAfter, {
                user: extractUser(user),
                token,
            });
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
                user: extractUser(user),
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

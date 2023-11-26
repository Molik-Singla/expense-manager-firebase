import React, { useState } from "react";

// 👉 ---------------------------------- Hooks -------------------------------------- //
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// 👉 -------------------------------- Components ----------------------------------- //
import TextField from "../components/Inputs/TextField";
import Button from "../components/Layouts/Button";
import LoadingSpinner from "./../animations/LoadingSpinner";

// 👉 --------------------------------- Others -------------------------------------- //
import { login } from "../store/authSlice";
import { notifyError } from "../animations/Toastify";
import Cookies from "js-cookie";

const AuthPage = () => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { apiSignupWithEmailPassword, apiLoginWithEmailPassword, apiLoginWithGoogle, loginLoading, signupLoading } = useAuth();
    const [inputValues, setInputValues] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isSignUp, setIsSignUp] = useState(false);
    const myLoader = (
        <div className="flex justify-center w-full">
            <LoadingSpinner size="small" />
        </div>
    );

    const performAfterAuth = (data) => {
        // we can set time but default it is in "DAYS" like 7
        // let inTwoMinutes = new Date(new Date().getTime() + 2 * 60 * 1000);
        // set auth data when user perform auth and set values in Cookies
        dispatch(login({ token: data?.token, isLogin: true, user: data?.user }));
        Cookies.set("user", JSON.stringify(data?.user), { expires: parseInt(import.meta.env.VITE_COOKIE_EXPIRE_TIME) });
        Cookies.set("token", JSON.stringify(data?.token), { expires: parseInt(import.meta.env.VITE_COOKIE_EXPIRE_TIME) });
        navigate("/");
    };
    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    const handleOnChange = (evt) => {
        const { name, value } = evt.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };
    const handleAuthentication = async (evt) => {
        evt.preventDefault();

        if (isSignUp && inputValues.password !== inputValues.confirmPassword) {
            // Show error message on tooltip
            return notifyError("Password and Confirm Password must be same");
        } else if (isSignUp) {
            // signup
            apiSignupWithEmailPassword({ onAfter: performAfterAuth }, inputValues?.email, inputValues?.password);
        } else if (!isSignUp) {
            // Login
            apiLoginWithEmailPassword({ onAfter: performAfterAuth }, inputValues?.email, inputValues?.password);
        }
    };

    const handleAuthenticationWithGoogle = () => {
        apiLoginWithGoogle({
            onAfter: performAfterAuth,
        });
    };
    const handleChangeLoginOrSignup = () => setIsSignUp((prev) => !prev);

    return (
        <section className="flex items-center justify-center min-h-screen text-white bg-gray-900 font-primary">
            <form
                autoComplete="off"
                className="flex flex-col items-center gap-3 p-4 bg-transparent rounded-md w-[94%] md:w-4/5 max-w-[380px]"
            >
                <div className="flex flex-col w-full gap-4">
                    <TextField
                        type="email"
                        placeholder="Email"
                        required
                        label={"Email"}
                        name="email"
                        value={inputValues?.email}
                        onChange={handleOnChange}
                    />
                    <TextField
                        type="password"
                        placeholder="Password"
                        required
                        label={"Password"}
                        minLength={6}
                        name="password"
                        value={inputValues?.password}
                        onChange={handleOnChange}
                    />
                    {isSignUp && (
                        <TextField
                            type="password"
                            placeholder="Confirm password"
                            required={isSignUp}
                            label={"Confirm Password"}
                            minLength={6}
                            name="confirmPassword"
                            value={inputValues?.confirmPassword}
                            onChange={handleOnChange}
                        />
                    )}
                </div>
                <Button type="submit" onClick={handleAuthentication}>
                    {!loginLoading && !signupLoading && (isSignUp ? "Signup" : "Login")}
                    {loginLoading && myLoader}
                    {signupLoading && myLoader}
                </Button>
                <div className="flex items-center justify-center w-full gap-2 text-sm sm:text-base">
                    <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
                    <Button
                        onClick={handleChangeLoginOrSignup}
                        className="text-blue-400 transition-all duration-150 origin-center cursor-pointer hover:scale-105"
                    >
                        {isSignUp ? "Login" : "Signup"}
                    </Button>
                </div>
                <div className="relative flex items-center justify-center w-full h-4 mt-6">
                    <div className="absolute px-3 bg-gray-900">Or</div>
                    <div className="w-full h-[1px] bg-white mx-1"></div>
                </div>

                <Button onClick={handleAuthenticationWithGoogle} additionalClasses="text-white bg-red-600 hover:bg-red-500">
                    Signup with Google
                </Button>
            </form>
        </section>
    );
};

export default AuthPage;

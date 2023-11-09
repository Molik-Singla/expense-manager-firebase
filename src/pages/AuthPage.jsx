import React, { useState } from "react";

// 👉 ---------------------------------- Hooks -------------------------------------- //
import { useDispatch } from "react-redux";

// 👉 -------------------------------- Components ----------------------------------- //
import { TextField } from "../components";

// 👉 --------------------------------- Others -------------------------------------- //
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isSignUp, setIsSignUp] = useState(false);

    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    const handleOnChange = (evt) => {
        const { name, value } = evt.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        console.log(inputValues);
        dispatch(login());
        navigate("/");
    };

    return (
        <section className="flex items-center justify-center min-h-screen text-white bg-gray-900 font-primary">
            <form
                autoComplete="off"
                onSubmit={handleSubmit}
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
                <button className="w-full p-2 mt-4 font-semibold text-black transition-all duration-200 bg-gray-200 rounded-lg hover:bg-gray-50">
                    {isSignUp ? "Signup" : "Login"}
                </button>
                <div className="flex items-center justify-center w-full gap-2 text-sm sm:text-base">
                    <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
                    <button
                        onClick={() => setIsSignUp((prev) => !prev)}
                        className="text-blue-400 transition-all duration-150 origin-center cursor-pointer hover:scale-105"
                    >
                        {isSignUp ? "Login" : "Signup"}
                    </button>
                </div>
                <div className="relative flex items-center justify-center w-full h-4 mt-6">
                    <div className="absolute px-3 bg-gray-900">Or</div>
                    <div className="w-full h-[1px] bg-white mx-1"></div>
                </div>

                <button className="w-full p-2 mt-4 font-medium text-white transition-all duration-200 bg-red-600 rounded-lg hover:bg-red-500">
                    Signup with Google
                </button>
            </form>
        </section>
    );
};

export default AuthPage;

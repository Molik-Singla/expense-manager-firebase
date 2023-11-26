import React, { useEffect, useRef } from "react";

// 👉 ---------------------------------- Hooks -------------------------------------- //
import { useDispatch } from "react-redux";

// 👉 -------------------------------- Components ----------------------------------- //
import { AuthPage, HomePage } from "./pages";
import LoadingSpinner from "./animations/LoadingSpinner";

// 👉 --------------------------------- Others -------------------------------------- //
import { Routes, Route, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./routes";
import { firebaseAuth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { login } from "./store/authSlice";

const App = () => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // show loading only first time
    const loadingFirstRef = useRef(true);

    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    // navigate the user according to it is login or not
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                // console.log(new Date(parseInt(user?.metadata?.lastLoginAt)));
                // console.log(new Date(user?.stsTokenManager?.expirationTime));

                console.log("User is Here...");
                loadingFirstRef.current = false;
                dispatch(login({ token: user?.accessToken, isLogin: true }));
                navigate("/");
            } else {
                loadingFirstRef.current = false;
                navigate("/auth");
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <>
            {loadingFirstRef.current ? (
                <section className="flex items-center justify-center w-full h-full min-h-screen bg-black font-primary">
                    <LoadingSpinner />
                </section>
            ) : (
                <section>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/auth" element={<AuthPage />} />

                        <Route
                            path="*"
                            element={
                                <div className="flex items-center justify-center w-full h-screen text-4xl">404 Not Found</div>
                            }
                        />
                    </Routes>
                </section>
            )}
        </>
    );
};

export default App;

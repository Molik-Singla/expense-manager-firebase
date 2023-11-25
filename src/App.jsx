import React, { useEffect } from "react";

// 👉 -------------------------------- Components ----------------------------------- //
import { AuthPage, HomePage } from "./pages";
import { ProtectedRoute } from "./routes";
import { Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, selectAuth } from "./store/authSlice";

const App = () => {
    const dispatch = useDispatch();
    const authState = useSelector(selectAuth);
    const navigate = useNavigate();

    onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
            // console.log(new Date(parseInt(user?.metadata?.lastLoginAt)));
            // console.log(new Date(user?.stsTokenManager?.expirationTime));
            if (user) {
                dispatch(login({ token: user?.accessToken, isLogin: true }));
            }
        } else {
            console.log("User is not here");
        }
    });

    // navigate the user according to it is login or not
    useEffect(() => {
        console.log(authState);
        if (authState?.isLogin) {
            console.log("User is here");
            navigate("/");
        } else navigate("/auth");
    }, [authState]);

    return (
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
                    element={<div className="flex items-center justify-center w-full h-screen text-4xl">404 Not Found</div>}
                />
            </Routes>
        </section>
    );
};

export default App;

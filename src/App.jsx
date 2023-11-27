import React, { useEffect, useRef } from "react";

// 👉 ---------------------------------- Hooks -------------------------------------- //
import { useDispatch } from "react-redux";

// 👉 -------------------------------- Components ----------------------------------- //
import { AuthPage, HomePage } from "./pages";
import LoadingSpinner from "./animations/LoadingSpinner";

// 👉 --------------------------------- Others -------------------------------------- //
import Cookies from "js-cookie";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./routes";
import { login } from "./store/authSlice";

const App = () => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // show loading only first time
    const loadingFirstRef = useRef(true);

    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    // navigate the user according to it is login or not
    // When user is login then we have user data in cookies so we can get it from there and update the state
    useEffect(() => {
        const userData = JSON.parse(Cookies.get("user") || null);
        const tokenData = JSON.parse(Cookies.get("token") || null);

        if (userData?.uid && tokenData) {
            dispatch(login({ isLogin: true, user: userData, token: tokenData }));
            navigate("/");
        } else {
            navigate("/auth");
        }
        loadingFirstRef.current = false;
    }, []);

    // onAuthStateChanged(firebaseAuth, (user) => {
    //     if (user) {
    //         // console.log(new Date(parseInt(user?.metadata?.lastLoginAt)));
    //         // console.log(new Date(user?.stsTokenManager?.expirationTime));

    //         console.log(user?.accessToken);
    //         const tokenData = JSON.parse(Cookies.get("token") || null);
    //         console.log(tokenData);
    //     }
    // });

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
// console.log(new Date(parseInt(user?.metadata?.lastLoginAt)));
// console.log(new Date(user?.stsTokenManager?.expirationTime));
// useEffect(() => {
//     const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
//         if (user) {
//             // if we have user then get the user saved data from Cookies and update state ( while login first time it happens from api login function as we can set the cookies there )
//             console.log("User is Here... ");
//             loadingFirstRef.current = false;

//             const userData = JSON.parse(Cookies.get("user") || "{}");
//             const tokenData = JSON.parse(Cookies.get("token") || "{}");

//             if (userData?.uid == user?.uid && tokenData) dispatch(login({ isLogin: true, user: userData, token: tokenData }));
//             else dispatch(login({ isLogin: true }));

//             navigate("/");
//         } else {
//             loadingFirstRef.current = false;
//             navigate("/auth");
//         }
//     });
//     return () => unsubscribe();
// }, []);

// Concepts =>

// 1. Protected Route ( Wrapper Component )
// 2. Cookies ( to store user data and token )
// 3. Redux Toolkit ( to manage state )
// 4. Firebase Auth ( to manage auth )
// 5. Firebase Firestore ( to manage database )
// 6. Advance Callbacks ( to manage async functions )
// 7. Custom Hooks ( to manage common logic )
// 8. React Router
// 9. Code Refactoring ( to manage code )

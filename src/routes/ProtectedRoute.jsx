import React from "react";

// 👉 ---------------------------------- Hooks -------------------------------------- //
import { useSelector } from "react-redux";

// 👉 -------------------------------- Components ----------------------------------- //
import { Navigate } from "react-router-dom";

// 👉 --------------------------------- Others -------------------------------------- //
import { selectAuth } from "../store/authSlice";

const ProtectedRoute = ({ children }) => {
    const authState = useSelector(selectAuth);
    return !authState?.isLogin ? <Navigate to="/auth" /> : children;
};

export default ProtectedRoute;

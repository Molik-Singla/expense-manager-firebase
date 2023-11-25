import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogin: false,
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLogin = true;
            state.user = action?.payload?.user || null;
            state.token = action?.payload?.token || null;
        },
        logout: (state) => {
            state.isLogin = false;
            state.user = null;
            state.token = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;

export default authSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";

import transactionSlice from "./transactionSlice";
import authSlice from "./authSlice";

const store = configureStore({
    reducer: {
        transaction: transactionSlice,
        auth: authSlice,
    },
});

export default store;

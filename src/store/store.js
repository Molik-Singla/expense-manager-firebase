import { configureStore } from "@reduxjs/toolkit";

import transactionSlice from "./transactionSlice";

const store = configureStore({
    reducer: {
        transaction: transactionSlice,
    },
});

export default store;

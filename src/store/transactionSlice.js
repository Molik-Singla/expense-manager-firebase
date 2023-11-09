import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    transactions: [
        {
            id: nanoid(),
            title: "Buy new Bike",
            description: "I need a new bike for my daily commute",
            amount: 78900,
            date: new Date().toISOString().split("T")[0],
            transactionType: "expense",
        },
    ],
};

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        deleteTransaction: (state, action) => {
            state.transactions = state.transactions.filter((transaction) => transaction.id !== action.payload);
        },
        addTransaction: {
            reducer: (state, action) => {
                state.transactions.push(action.payload);
            },
            // Set id to a random string
            prepare: (transactionPayload) => {
                return {
                    payload: {
                        id: nanoid(),
                        ...transactionPayload,
                    },
                };
            },
        },
    },
});

export const { addTransaction, deleteTransaction } = transactionSlice.actions;
export const selectTransactions = (state) => state.transaction.transactions;

export default transactionSlice.reducer;

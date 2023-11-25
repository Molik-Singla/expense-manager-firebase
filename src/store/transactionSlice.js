import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    transactions: [],
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
                        ...transactionPayload,
                    },
                };
            },
        },
        addTransactions: (state, action) => {
            state.transactions = [...state.transactions, ...action.payload];
        },
        editTransaction: (state, action) => {
            const { id, title, description, amount, date, transactionType } = action.payload;
            const existingTransaction = state.transactions.find((transaction) => transaction.id === id);
            if (existingTransaction) {
                existingTransaction.title = title;
                existingTransaction.description = description;
                existingTransaction.amount = amount;
                existingTransaction.date = date;
                existingTransaction.transactionType = transactionType;
            }
        },
    },
});

export const { addTransaction, deleteTransaction, editTransaction, addTransactions } = transactionSlice.actions;
export const selectTransactions = (state) => state.transaction.transactions;

export default transactionSlice.reducer;

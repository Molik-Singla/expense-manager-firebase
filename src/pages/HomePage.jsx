import React, { useEffect } from "react";

// 👉 ---------------------------------- Hooks -------------------------------------- //
import useFirestore from "../hooks/useFirestore";
import useAuth from "../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";

// 👉 -------------------------------- Components ----------------------------------- //
import SingleTransaction from "../components/Others/SingleTransaction";
import TransactionForm from "../components/Others/TransactionForm";
import Button from "../components/Layouts/Button";
import LoadingSpinner from "../animations/LoadingSpinner";

// 👉 --------------------------------- Others -------------------------------------- //
import {
    addTransaction,
    addTransactions,
    selectTransactions,
    editTransaction,
    deleteTransaction,
    clearTransactions,
} from "../store/transactionSlice";
import { logout } from "../store/authSlice";
import { INPUT_VALUES_INITIAL_STATE } from "../utils/constants";

const HomePage = () => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const dispatch = useDispatch();
    const transactions = useSelector(selectTransactions);

    const { apiAddDoc, apiDeleteDoc, apiGetDocs, apiUpdateDoc, getLoading, addLoading } = useFirestore(null, "expenses");
    const { apiLogout } = useAuth();

    const totalAmount = transactions
        ?.reduce((acc, next) => {
            return next?.transactionType === "expense" ? acc - parseInt(next?.amount) : acc + parseInt(next?.amount);
        }, 0)
        ?.toLocaleString();

    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    const apiGetTransactions = () => {
        apiGetDocs({
            onAfter: (data) => {
                dispatch(addTransactions(data));
            },
        });
    };
    const handleAddNewTransaction = (newValues) => {
        const newData = {
            title: newValues?.title,
            description: newValues?.description,
            amount: newValues?.amount,
            date: newValues?.date,
            transactionType: newValues?.transactionType,
        };

        apiAddDoc(
            {
                onAfter: (response) =>
                    dispatch(
                        addTransaction({
                            id: response?.id,
                            ...newData,
                        })
                    ),
            },
            newData
        );
    };
    const handleDeleteTransaction = (id = null) => {
        if (!id) throw new Error("Please provide a valid ID");
        apiDeleteDoc(
            {
                onBefore: () => dispatch(deleteTransaction(id)),
            },
            id
        );
    };
    const handleEditTransaction = (newValues) => {
        apiUpdateDoc(
            {
                onBefore: () => dispatch(editTransaction(newValues)),
            },
            newValues?.id,
            newValues
        );
    };
    const handleLogout = () => {
        apiLogout({
            onAfter: () => {
                dispatch(logout());
                dispatch(clearTransactions());
            },
        });
    };

    useEffect(() => {
        apiGetTransactions();
    }, []);

    return (
        <section className="flex items-center justify-center w-full h-full min-h-screen bg-black font-primary">
            <section className="fixed top-0 flex justify-end w-full p-4">
                <div>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            </section>
            <section className="flex flex-col w-full h-screen max-w-xl gap-3 px-4 pt-24 pb-8 text-white bg-transparent">
                <div className="flex justify-center text-4xl font-semibold md:text-5xl">
                    <p>
                        <span className="mr-2">₹</span>
                        {totalAmount}
                    </p>
                </div>

                <TransactionForm handleWorkingOfInputs={handleAddNewTransaction} initialValues={INPUT_VALUES_INITIAL_STATE} />

                <section className="flex flex-col h-full gap-5 py-3 mt-4 overflow-auto transactions">
                    {(getLoading || addLoading) && (
                        <section className="flex justify-center w-full py-2">
                            <LoadingSpinner />
                        </section>
                    )}
                    {transactions.map((transaction) => {
                        return (
                            <SingleTransaction
                                key={transaction?.id}
                                id={transaction?.id}
                                title={transaction?.title}
                                description={transaction?.description}
                                amount={transaction?.amount}
                                date={transaction?.date}
                                transactionType={transaction?.transactionType}
                                handleDelete={handleDeleteTransaction}
                                handleEdit={handleEditTransaction}
                            />
                        );
                    })}
                </section>
            </section>
        </section>
    );
};

export default HomePage;

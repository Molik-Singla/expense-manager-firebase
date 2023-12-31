import React, { useEffect } from "react";

// 👉 ---------------------------------- Hooks -------------------------------------- //
import { useSelector, useDispatch } from "react-redux";
import useFirestore from "../hooks/useFirestore";
import useAuth from "../hooks/useAuth";

// 👉 -------------------------------- Components ----------------------------------- //
import SingleTransaction from "../components/Others/SingleTransaction";
import TransactionForm from "../components/Others/TransactionForm";
import Button from "../components/Layouts/Button";
import LoadingSpinner from "../animations/LoadingSpinner";

// 👉 --------------------------------- Others -------------------------------------- //
import Cookies from "js-cookie";
import { logout, selectAuth } from "../store/authSlice";
import { where } from "firebase/firestore";
import {
    addTransaction,
    addTransactions,
    selectTransactions,
    editTransaction,
    deleteTransaction,
    clearTransactions,
} from "../store/transactionSlice";
import { INPUT_VALUES_INITIAL_STATE } from "../utils/constants";

const HomePage = () => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const dispatch = useDispatch();
    const transactions = useSelector(selectTransactions);
    const currentUser = useSelector(selectAuth);

    const { apiAddDoc, apiDeleteDoc, apiUpdateDoc, apiGetDocsByQuery, getLoading, addLoading } = useFirestore(null, "expenses");
    const { apiLogout } = useAuth();

    const totalAmount = transactions
        ?.reduce((acc, next) => {
            return next?.transactionType === "expense" ? acc - parseInt(next?.amount) : acc + parseInt(next?.amount);
        }, 0)
        ?.toLocaleString();

    const sortByDate = (arrList, dateKey) => {
        return arrList.sort((obj1, obj2) => {
            const dateA = new Date(obj1[dateKey]);
            const dateB = new Date(obj2[dateKey]);
            return dateA - dateB;
        });
    };
    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    const apiGetTransactions = () => {
        apiGetDocsByQuery(
            {
                onAfter: (data) => {
                    const sorterData = sortByDate(data, "date");
                    dispatch(addTransactions(sorterData));
                },
            },
            where("userID", "==", currentUser?.user?.uid)
        );
    };
    const handleAddNewTransaction = (newValues = null) => {
        if (!newValues) throw new Error("Please provide some data");
        const newData = {
            title: newValues?.title,
            description: newValues?.description,
            amount: newValues?.amount,
            date: newValues?.date,
            transactionType: newValues?.transactionType,
            userID: currentUser?.user?.uid,
        };

        apiAddDoc(
            {
                onAfter: (response) =>
                    dispatch(
                        addTransaction({
                            // doc id
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
    const handleEditTransaction = (newValues = null) => {
        if (!newValues) throw new Error("Please provide some data");
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
                Cookies.remove("user");
                Cookies.remove("token");
            },
        });
    };

    useEffect(() => {
        if (currentUser?.user?.uid) apiGetTransactions();
    }, [currentUser]);

    return (
        <section className="flex flex-col items-center justify-center w-full h-screen min-h-screen bg-black font-primary">
            <section className="static top-0 flex items-end justify-end w-full p-1 pr-4 h-14">
                <div>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            </section>
            <section className="flex flex-col w-full h-[calc(100vh-3.5rem)] max-w-xl gap-3 px-4 pt-16 pb-8 text-white bg-transparent">
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

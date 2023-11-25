import React, { useEffect } from "react";

// 👉 ---------------------------------- Hooks -------------------------------------- //
import { useSelector, useDispatch } from "react-redux";

// 👉 -------------------------------- Components ----------------------------------- //
import { SingleTransaction, TransactionForm } from "../components";

// 👉 --------------------------------- Others -------------------------------------- //
import {
    addTransaction,
    deleteTransaction,
    editTransaction,
    selectTransactions,
    addTransactions,
} from "../store/transactionSlice";
import { INPUT_VALUES_INITIAL_STATE } from "../utils/constants";
import useFirestore from "../hooks/useFirestore";

const HomePage = () => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const dispatch = useDispatch();
    const transactions = useSelector(selectTransactions);

    const { apiAddDoc, apiDeleteDoc, apiGetDocs, apiUpdateDoc } = useFirestore(null, "expenses");

    // 👉 -------------------------- Functions/ useEffect ------------------------------- //

    const apiGetExpenses = () => {
        apiGetDocs((data) => {
            dispatch(addTransactions(data));
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

        apiAddDoc((id) => {
            dispatch(
                addTransaction({
                    id,
                    ...newData,
                })
            );
        }, newData);
    };
    const handleDeleteTransaction = (id = null) => {
        if (!id) throw new Error("Please provide a valid ID");
        apiDeleteDoc(() => {
            dispatch(deleteTransaction(id));
        }, id);
        // await deleteDoc(doc(firebaseStore, "expenses", id));
    };
    const handleEditTransaction = (newValues) => {
        apiUpdateDoc(
            () => {
                dispatch(editTransaction(newValues));
            },
            newValues?.id,
            newValues
        );
    };

    useEffect(() => {
        apiGetExpenses();
    }, []);

    return (
        <section className="flex items-center justify-center w-full h-full min-h-screen bg-black font-primary">
            <section className="flex flex-col w-full h-screen max-w-xl gap-3 px-4 pt-24 pb-8 text-white bg-transparent">
                <div className="flex justify-center text-4xl font-semibold md:text-5xl">
                    <p>
                        <span className="mr-2">₹</span>
                        {transactions
                            ?.reduce((acc, next) => {
                                return next?.transactionType === "expense"
                                    ? acc - parseInt(next?.amount)
                                    : acc + parseInt(next?.amount);
                            }, 0)
                            ?.toLocaleString()}
                    </p>
                </div>

                <TransactionForm handleWorkingOfInputs={handleAddNewTransaction} initialValues={INPUT_VALUES_INITIAL_STATE} />

                <section className="flex flex-col h-full gap-5 py-3 mt-4 overflow-auto transactions">
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

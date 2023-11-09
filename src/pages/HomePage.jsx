import React, { useState } from "react";

// 👉 ---------------------------------- Hooks -------------------------------------- //
import { useSelector, useDispatch } from "react-redux";

// 👉 -------------------------------- Components ----------------------------------- //
import { SingleTransaction, TransactionForm } from "../components";

// 👉 --------------------------------- Others -------------------------------------- //
import { addTransaction, deleteTransaction, selectTransactions } from "../store/transactionSlice";
import { INPUT_VALUES_INITIAL_STATE } from "../utils/constants";

const HomePage = () => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const dispatch = useDispatch();

    const [inputValues, setInputValues] = useState({
        ...INPUT_VALUES_INITIAL_STATE,
    });
    const transactions = useSelector(selectTransactions);

    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    const handleOnChange = (evt) => {
        const { name, value } = evt.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddNewTransaction = (evt) => {
        evt.preventDefault();
        dispatch(
            addTransaction({
                ...inputValues,
            })
        );

        setInputValues({
            ...INPUT_VALUES_INITIAL_STATE,
        });
    };
    const handleDeleteTransaction = (id = null) => {
        if (!id) throw new Error("Please provide a valid ID");
        dispatch(deleteTransaction(id));
    };

    return (
        <section className="flex items-center justify-center w-full h-full min-h-screen bg-black font-primary">
            <section className="flex flex-col w-full h-screen max-w-xl gap-3 px-4 pt-24 pb-8 text-white bg-transparent">
                <div className="flex justify-center text-4xl font-semibold md:text-5xl">
                    <p>
                        <span className="mr-1">₹</span>
                        {transactions?.reduce((acc, next) => {
                            return next?.transactionType === "expense"
                                ? acc - parseInt(next?.amount)
                                : acc + parseInt(next?.amount);
                        }, 0)}
                    </p>
                </div>

                <TransactionForm />

                <section className="h-full mt-4 overflow-auto transactions">
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
                            />
                        );
                    })}
                </section>
            </section>
        </section>
    );
};

export default HomePage;

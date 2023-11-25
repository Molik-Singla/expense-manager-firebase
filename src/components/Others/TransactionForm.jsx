import React, { useState } from "react";

// 👉 -------------------------------- Components ----------------------------------- //
import { TextField } from "../../components";

const TransactionForm = ({ handleWorkingOfInputs, initialValues, buttonText = "Add new Transaction" }) => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const [inputValues, setInputValues] = useState({ ...initialValues });

    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    const handleSubmit = (evt) => {
        evt.preventDefault();
        handleWorkingOfInputs(inputValues);

        setInputValues({
            ...initialValues,
        });
    };
    const handleOnChange = (evt) => {
        const { name, value, type } = evt.target;
        // change below code so that type="number" can also work
        setInputValues((prev) => ({ ...prev, [name]: type === "number" ? parseInt(value) : value }));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2" autoComplete="off" autoCorrect="off">
            <div className="grid w-full grid-cols-2 gap-2 mt-4">
                <TextField required placeholder="Title" name={"title"} onChange={handleOnChange} value={inputValues?.title} />
                <TextField
                    placeholder="Select a date"
                    type="date"
                    className="custom-date-input"
                    name={"date"}
                    onChange={handleOnChange}
                    value={inputValues?.date}
                />
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
                <TextField
                    required
                    type="number"
                    placeholder="Amount"
                    name={"amount"}
                    onChange={handleOnChange}
                    value={inputValues?.amount === 0 ? "" : inputValues?.amount}
                />

                <select
                    name="transactionType"
                    value={inputValues?.transactionType}
                    onChange={handleOnChange}
                    className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                    <option className="dark:bg-gray-700 dark:py-2" value="expense">
                        Expense
                    </option>
                    <option className="dark:bg-gray-700 dark:py-2" value="income">
                        Income
                    </option>
                </select>
            </div>

            <TextField
                placeholder="Description"
                name={"description"}
                onChange={handleOnChange}
                value={inputValues?.description}
            />

            <button className="w-full p-2 mt-4 font-semibold text-black transition-all duration-200 bg-gray-200 rounded-lg hover:bg-gray-50">
                {buttonText}
            </button>
        </form>
    );
};

export default TransactionForm;

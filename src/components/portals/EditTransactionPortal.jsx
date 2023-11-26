import React from "react";
import ReactDOM from "react-dom";

// 👉 -------------------------------- Components ----------------------------------- //
import TransactionForm from "../Others/TransactionForm";
import Button from "../Layouts/Button";

// 👉 -------------------------------------- ICONS -------------------------------------- //
import { RxCross2 } from "react-icons/rx";

const EditTransactionPortal = ({ isPortalOpen, initialValues, handleClosePortal, handleEdit }) => {
    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    const handleEditTransaction = (newValues) => {
        handleEdit(newValues);
        handleClosePortal();
    };

    if (!isPortalOpen) return null;

    return ReactDOM.createPortal(
        <>
            <section className="flex items-center justify-center w-full h-screen text-white bg-gray-900 font-primary">
                <section className="flex flex-col w-4/5 max-w-md p-6 bg-transparent border-2 border-gray-300 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-500">
                        <p className="text-xl">Edit</p>
                        <Button
                            onClick={handleClosePortal}
                            className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-md cursor-pointer"
                        >
                            <RxCross2 className="text-lg text-white cursor-pointer" />
                        </Button>
                    </div>
                    <TransactionForm
                        handleWorkingOfInputs={handleEditTransaction}
                        initialValues={initialValues}
                        buttonText="Edit Transaction"
                    />
                </section>
            </section>
        </>,
        document.getElementById("portals")
    );
};

export default EditTransactionPortal;

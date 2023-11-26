import React, { useState } from "react";

// 👉 -------------------------------- Components ----------------------------------- //
import EditTransactionPortal from "../portals/EditTransactionPortal";
import Button from "../Layouts/Button";

// 👉 -------------------------------------- ICONS -------------------------------------- //
import { MdModeEdit, MdDelete } from "react-icons/md";

const SingleTransaction = ({ id, title, description = "", amount = 0, date = "", transactionType, handleDelete, handleEdit }) => {
    // 👉 ---------------------------- States/ Variables -------------------------------- //
    const [isEditPortal, setIsEditPortal] = useState(false);
    const initialStateForEdit = {
        id,
        title,
        description,
        amount,
        date,
        transactionType,
    };

    // 👉 -------------------------- Functions/ useEffect ------------------------------- //
    const handleOpenPortal = () => setIsEditPortal(true);
    const handleClosePortal = () => setIsEditPortal(false);
    const handleDeleteTransaction = () => handleDelete(id);

    return (
        <>
            <EditTransactionPortal
                initialValues={initialStateForEdit}
                handleEdit={handleEdit}
                handleClosePortal={handleClosePortal}
                isPortalOpen={isEditPortal}
            />

            <section className="flex flex-col gap-4 p-2 single">
                <div className="flex justify-between w-full">
                    <div className="flex flex-col gap-[2px] w-full">
                        <p className="text-xl text-gray-200 md:text-2xl">{title}</p>
                        <p className="text-gray-500 max-w-[86%]">{description}</p>
                    </div>

                    <div className="flex flex-col items-end min-w-fit">
                        <p
                            className={`text-xl md:text-2xl font-medium ${
                                transactionType === "expense" ? "text-red-600" : "text-green-600"
                            }`}
                        >
                            {amount?.toLocaleString()}
                        </p>
                        <p className="text-gray-500">{date}</p>
                    </div>
                </div>

                <div className="flex flex-row self-end gap-4">
                    <Button
                        onClick={handleOpenPortal}
                        className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-md cursor-pointer"
                    >
                        <MdModeEdit className="text-lg text-white cursor-pointer" />
                    </Button>
                    <Button
                        onClick={handleDeleteTransaction}
                        className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-md cursor-pointer"
                    >
                        <MdDelete className="text-lg text-white cursor-pointer" />
                    </Button>
                </div>
            </section>
        </>
    );
};

export default SingleTransaction;

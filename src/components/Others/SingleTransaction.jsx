import React from "react";

// 👉 -------------------------------------- ICONS -------------------------------------- //
import { MdModeEdit, MdDelete } from "react-icons/md";
import EditTransactionPortal from "../portals/EditTransactionPortal";

const SingleTransaction = ({ id, title, description = "", amount = 0, date = "", transactionType, handleDelete }) => {
    return (
        <>
            <EditTransactionPortal />
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
                            {transactionType === "expense" ? "-" : ""}
                            {amount}
                        </p>
                        <p className="text-gray-500">{date}</p>
                    </div>
                </div>

                <div className="flex flex-row self-end gap-4">
                    <button className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-md cursor-pointer">
                        <MdModeEdit className="text-lg text-white cursor-pointer" />
                    </button>
                    <button
                        onClick={() => handleDelete(id)}
                        className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-md cursor-pointer"
                    >
                        <MdDelete className="text-lg text-white cursor-pointer" />
                    </button>
                </div>
            </section>
        </>
    );
};

export default SingleTransaction;

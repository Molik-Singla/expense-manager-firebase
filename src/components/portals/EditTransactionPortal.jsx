import React from "react";
import ReactDOM from "react-dom";

const EditTransactionPortal = () => {
    return ReactDOM.createPortal(
        <>
            <section className="flex items-center justify-center w-full h-screen bg-red-500">
                <section className="flex flex-col bg-white rounded-lg shadow-lg w-96 h-96">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque repellat iusto porro corrupti numquam, natus
                    distinctio, reprehenderit vero ad ab dolorum magnam officiis soluta assumenda perspiciatis! Vitae dignissimos
                    sed explicabo?
                </section>
            </section>
        </>,
        document.getElementById("portals")
    );
};

export default EditTransactionPortal;

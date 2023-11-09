import React, { useId } from "react";

const TextField = ({ label = null, placeholder = "", type = "text", className = "", ...props }) => {
    const id = useId();

    return (
        <div className="flex flex-col w-full gap-2 single-input">
            {label && (
                <label className="font-medium" htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                className={`w-full p-2 px-4 border-2 border-gray-700 focus:border-gray-400 rounded-lg outline-none bg-transparent ${className}`}
                {...props}
            />
        </div>
    );
};

export default TextField;

import React from "react";

const Button = ({ children, additionalClasses = "", className = "", onClick, type = "button", disabled = false }) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`${
                className
                    ? className
                    : "w-full h-9 px-8 mt-2 font-semibold text-black transition-all duration-200 bg-gray-200 rounded-lg hover:bg-gray-50 " +
                      additionalClasses
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;

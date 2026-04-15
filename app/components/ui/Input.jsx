import React from "react";

const Input = React.forwardRef(function Input(
  { className = null, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`
        w-full px-4 py-2 
        border border-gray-300 
        rounded-lg 
        bg-white 
        text-black
        text-sm 
        outline-none 
        transition
        focus:border-[#2563EB]
        focus:ring-1 focus:ring-black
        placeholder:text-gray-400
        ${className}
      `}
      {...props}
    />
  );
});

export default Input;

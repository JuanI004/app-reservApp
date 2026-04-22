import React from "react";

const Input = React.forwardRef(function Input(
  { className = null, type = "text", ...props },
  ref,
) {
  const inputProps = { ...props };

  if ("value" in inputProps && inputProps.value == null) {
    inputProps.value = "";
  }

  return (
    <input
      ref={ref}
      type={type}
      className={`
         px-4 py-2 
        border border-gray-300 
        rounded-xl 
        bg-background
        text-black
        text-sm 
        outline-none 
        transition
        focus:border-brand
        focus:ring-1 focus:ring-black
        placeholder:text-gray-400
        ${className === null ? "w-full" : className}
      `}
      {...inputProps}
    />
  );
});

export default Input;

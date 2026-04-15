export function Label({ className = "", ...props }) {
  return (
    <label
      className={`text-sm font-medium text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`.trim()}
      {...props}
    />
  );
}

Label.displayName = "Label";

export default Label;

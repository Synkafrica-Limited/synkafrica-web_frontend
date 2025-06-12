export default function Button({ variant = "filled", size = "md", children, ...props }) {
    const base = "inline-flex items-center justify-center font-medium transition rounded focus:outline-none";
    const sizes = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
    const variants = {
      filled: "bg-primary text-white hover:bg-primary-600 disabled:opacity-50",
      outline: "border border-primary text-primary hover:bg-primary-50 disabled:opacity-50",
    };
  
    return (
      <button
        className={`${base} ${sizes[size]} ${variants[variant]}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  
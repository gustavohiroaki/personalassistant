import { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
        secondary: "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500 disabled:bg-gray-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
        warning: "bg-yellow-600 text-black hover:bg-yellow-700 hover:text-white focus:ring-yellow-500 disabled:bg-yellow-300",
        outline: "border-2 border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white focus:ring-gray-500 disabled:border-gray-600 disabled:text-gray-600"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
    };

    const widthClass = fullWidth ? "w-full" : "";
    const disabledClass = disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer";

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`;

    return (
        <button
            className={classes}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
import NextLink from "next/link"
import { ReactNode } from "react"

interface RedirectButtonProps {
    children: ReactNode,
    href: string,
    variant?: 'primary' | 'secondary' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    icon?: ReactNode;
}

export default function RedirectButton({
    children,
    href,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon
}: RedirectButtonProps) {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl",
        secondary: "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500 shadow-lg hover:shadow-xl",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl",
        outline: "border-2 border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white focus:ring-gray-500 bg-gray-800 hover:shadow-lg"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    const widthClass = fullWidth ? "w-full" : "";
    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass}`;

    return (
        <NextLink href={href} className={classes}>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </NextLink>
    );
}
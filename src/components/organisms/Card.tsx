import { ReactNode } from "react";
interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'bordered' | 'gradient';
}
export default function Card({ children, className = "", variant = 'default' }: CardProps) {
    const baseClasses = "rounded-lg p-6 transition-all duration-200";
    const variants = {
        default: "bg-gray-800 border border-gray-700 shadow-sm hover:shadow-md text-gray-100",
        elevated: "bg-gray-800 shadow-lg hover:shadow-xl border-0 text-gray-100",
        bordered: "bg-gray-800 border-2 border-gray-600 hover:border-blue-400 text-gray-100",
        gradient: "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:from-gray-700 hover:to-gray-800 text-gray-100"
    };
    const variantClasses = variants[variant];
    return (
        <div className={`${baseClasses} ${variantClasses} ${className}`}>
            {children}
        </div>
    );
}
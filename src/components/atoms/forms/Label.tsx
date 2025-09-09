import { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

export default function Label({ children, ...props }: LabelProps) {
    return (
        <label
            {...props}
            className="block text-sm font-medium text-gray-300 mb-1"
        >
            {children}
        </label>
    );
}

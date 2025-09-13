import { build } from "@/utils/tailwind-translator";
import { InputHTMLAttributes } from "react"
export default function Input({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
    const classes = build([
        'px-3',
        'py-2',
        'rounded',
        'border',
        'border-gray-700',
        'bg-gray-900',
        'text-gray-100',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-blue-500',
        'placeholder-gray-400'
    ]);
    return (
        <input
            className={classes}
            {...props}
        />
    );
}
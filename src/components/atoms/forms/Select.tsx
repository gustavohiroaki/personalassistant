import { build } from "@/utils/tailwind-translator";
import { SelectHTMLAttributes } from "react"
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
}
export default function Select({ options, ...props }: SelectProps) {
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
        <select
            className={classes}
            {...props}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
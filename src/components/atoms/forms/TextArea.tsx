import { build } from "@/utils/tailwind-translator";
import { TextareaHTMLAttributes } from "react"


export default function TextArea({ ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
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
        'placeholder-gray-400',
        'resize-none',
        'min-h-[80px]'
    ]);
    return (
        <textarea
            className={classes}
            {...props}
        />
    );
}
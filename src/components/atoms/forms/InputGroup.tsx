import { build } from "@/utils/tailwind-translator";
import { HTMLAttributes } from "react"

interface LabelProps {
    htmlFor: string;
    text: string;
}

interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    label?: LabelProps;
}

export default function InputGroup({ label, children }: InputGroupProps) {
    const inputGroupClasses = build([
        'flex',
        'flex-col',
        'gap-1'
    ]);
    const labelClasses = build([
        'font-medium',
        'text-gray-200'
    ]);
    return (
        <div className={inputGroupClasses}>
            {label && <label htmlFor={label.htmlFor} className={labelClasses}>{label.text}</label>}
            {children}
        </div>
    );
}
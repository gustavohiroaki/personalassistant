import { InputHTMLAttributes } from "react";
export default function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className="accent-blue-500 w-5 h-5 rounded focus:ring-2 focus:ring-blue-400 border-gray-400 border-2 transition-all duration-200"
            type="checkbox"
            {...props}
        />
    );
}
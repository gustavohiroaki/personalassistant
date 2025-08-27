import { build, Color, colors, hoverHelper } from "@/utils/tailwind-translator";
import { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    color?: Color;
}

export default function Button({ children, color = "primary", ...props }: ButtonProps) {
    const classes = build([
        'px-4',
        'py-2',
        'rounded',
        colors[color],
        hoverHelper(colors[color]),
        'cursor-pointer'
    ])

    return (
        <button
            className={classes}
            {...props}
        >
            {children}
        </button>
    );
}
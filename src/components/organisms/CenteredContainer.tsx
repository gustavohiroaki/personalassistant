import { build, Justify, justifyClasses } from "@/utils/tailwind-translator";
import { ReactNode } from "react"

interface CenteredContainerProps {
    children: ReactNode;
    justify?: Justify
}

export default function CenteredContainer({ children, justify = 'center' }: CenteredContainerProps) {
    const classes = build([
        'min-h-screen',
        'bg-gray-900',
        'flex',
        'flex-col',
        justifyClasses[justify],
        'items-center',
        'py-10'
    ])

    return (
        <div className={classes}>
            {children}
        </div >
    );
}
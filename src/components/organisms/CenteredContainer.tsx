import { build, Justify, justifyClasses } from "@/utils/tailwind-translator";
import { ReactNode } from "react"

interface CenteredContainerProps {
    children: ReactNode;
    justify?: Justify
}

export default function CenteredContainer({ children, justify = 'center' }: CenteredContainerProps) {
    const classes = build([
        'w-full',
        'bg-gray-900',
        'flex',
        'flex-col',
        justifyClasses[justify],
        'items-center',
        'py-10',
        'px-4'
    ])

    return (
        <div className={classes} style={{ height: 'calc(100vh - var(--header-height))' }}>
            {children}
        </div >
    );
}
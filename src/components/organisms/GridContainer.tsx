import { build, colClasses, Cols, Gap, gapClasses } from "@/utils/tailwind-translator";
import { ReactNode } from "react"

interface GridContainerProps {
    children: ReactNode;
    cols: Cols;
    gap?: Gap;
}

export default function GridContainer({ children, cols, gap = 2 }: GridContainerProps) {
    const classes = build([
        'grid',
        'p-5',
        colClasses[cols],
        gapClasses[gap]
    ])

    return (
        <div className={classes}>
            {children}
        </div>
    );
}
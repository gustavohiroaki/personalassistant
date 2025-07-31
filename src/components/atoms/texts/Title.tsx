import { ReactNode } from "react"

interface TitleProps {
    children: ReactNode
}

export default function Title({ children }: TitleProps) {
    return <h1 className="text-3xl text-gray-200">{children}</h1>
}
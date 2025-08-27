import NextLink from "next/link"
import { ReactNode } from "react"

interface RedirectButtonProps {
    children: ReactNode,
    href: string,
    theme: 'blue' | 'gray'
}

export default function RedirectButton({ children, href, theme }: RedirectButtonProps) {
    const classes = theme === 'blue' ?
        "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" :
        "bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
    return <NextLink href={href} className={classes}>{children}</NextLink>
}
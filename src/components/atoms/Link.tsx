import NextLink from "next/link"
import { ReactNode } from "react"

interface LinkProps {
    children: ReactNode,
    href: string,
    theme: 'blue' | 'gray'
}

export default function Link({ children, href, theme }: LinkProps) {
    const classes = theme === 'blue' ?
        "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" :
        "bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors ml-2"
    return <NextLink href={href} className={classes}>{children}</NextLink>
}
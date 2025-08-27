import Link from "next/link";
import RedirectButton from "../atoms/buttons/RedirectButton";

export default function Header() {
    return (
        <header className="bg-slate-950 header-height flex flex-row items-center justify-between px-4 w-full">
            <Link href="/" className="text-white hover:text-gray-300 transition-colors">Personal Assistant</Link>
            <RedirectButton theme="gray" href="/config">Config</RedirectButton>
        </header>
    )
}
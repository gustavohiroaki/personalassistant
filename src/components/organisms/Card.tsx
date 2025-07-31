import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
}

export default function Card({ children }: CardProps) {
    return (
        <div className="bg-gray-800 border-1 border-gray-700 rounded-lg p-6 h-80 w-3xl overflow-y-scroll scrollbar flex flex-col justify-between" >
            {children}
        </div>
    );
}
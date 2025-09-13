'use client'
interface CloseButtonProps {
    onClick: () => void,
}
export default function CloseButton(props: CloseButtonProps) {
    return <button className="text-red-700 hover:text-red-500" onClick={props.onClick}>✖</button>
}
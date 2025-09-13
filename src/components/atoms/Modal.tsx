interface ModalProps {
    open: boolean;
    handleCloseModal: () => void;
    children: React.ReactNode;
}
export default function Modal({ open, handleCloseModal, children }: ModalProps) {
    const classes = {
        open: "bg-black/50 fixed top-0 left-0 w-full h-full flex items-center justify-center",
        closed: "hidden"
    }
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        handleCloseModal();
    };
    return <div onClick={handleClick} className={open ? classes.open : classes.closed}>
        <div onClick={(e) => e.stopPropagation()} className="bg-gray-900 p-6 rounded-lg max-w-3xl w-full h-full max-h-2/3 overflow-y-scroll scrollbar flex items-center justify-center">
            {children}
        </div>
    </div>
}
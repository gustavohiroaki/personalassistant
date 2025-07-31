import Button from "../atoms/Button";
import Checkbox from "../atoms/Checkbox";

interface CardFooterProps {
    explainButtonAction: () => void
    editButtonAction: () => void
    checkboxAction: () => void
}

export default function CardFooter({ editButtonAction, explainButtonAction, checkboxAction }: CardFooterProps) {
    return (
        <div className="flex flex-row justify-between">
            <div className="gap-3 flex flex-row">
                <Button onClick={explainButtonAction}>Explain</Button>
                <Button onClick={editButtonAction}>Edit</Button>
            </div>
            <Checkbox
                name="done"
                id="done"
                onChange={checkboxAction}
            />
        </div>
    );
}
import { ChangeEvent } from "react";
import Button from "../atoms/Button";
import Checkbox from "../atoms/Checkbox";

interface CardFooterProps {
    explainButtonAction: () => void
    editButtonAction: () => void
    checkboxAction: (props: ChangeEvent<HTMLInputElement>) => void
    taskStatus: boolean
}

export default function CardFooter({ editButtonAction, explainButtonAction, checkboxAction, taskStatus }: CardFooterProps) {
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
                defaultChecked={taskStatus}
            />
        </div>
    );
}
import Button from "@/components/atoms/buttons/Button";
import InputGroup from "@/components/atoms/forms/InputGroup";
import TextArea from "@/components/atoms/forms/TextArea";
import CenteredContainer from "@/components/organisms/CenteredContainer";
import config from "./actions";

export default async function ConfigPage() {
    const userPrompt = await fetch("http://localhost:3000/api/userprompts");
    const response = await userPrompt.json()

    return (
        <CenteredContainer>
            <form className="w-full max-w-lvw h-full bg-gray-800 shadow-lg rounded-lg p-8 flex flex-col gap-6 border border-gray-700" action={config}>
                <InputGroup label={{ htmlFor: "user-prompt", text: "User prompt" }}>
                    <TextArea defaultValue={response.prompt} id="user-prompt" name="user-prompt" />
                </InputGroup>

                <Button type="submit">
                    Submit
                </Button>
            </form>
        </CenteredContainer>
    )
}
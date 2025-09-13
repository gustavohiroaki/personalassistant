"use client";
import { useState, useEffect } from "react";
import Button from "@/components/atoms/buttons/Button";
import InputGroup from "@/components/atoms/forms/InputGroup";
import TextArea from "@/components/atoms/forms/TextArea";
import CenteredContainer from "@/components/organisms/CenteredContainer";
import config from "./actions";
export default function ConfigPage() {
    const [userPrompt, setUserPrompt] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserPrompt = async () => {
            try {
                const response = await fetch("/api/userprompts");
                const data = await response.json();
                setUserPrompt(data.prompt || "");
            } catch (error) {
                console.error("Erro ao carregar prompt do usuário:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserPrompt();
    }, []);
    if (loading) {
        return (
            <CenteredContainer>
                <div className="text-center">Carregando...</div>
            </CenteredContainer>
        );
    }
    return (
        <CenteredContainer>
            <form className="w-full max-w-lvw h-full bg-gray-800 shadow-lg rounded-lg p-8 flex flex-col gap-6 border border-gray-700" action={config}>
                <InputGroup label={{ htmlFor: "user-prompt", text: "User prompt" }}>
                    <TextArea defaultValue={userPrompt} id="user-prompt" name="user-prompt" />
                </InputGroup>
                <Button type="submit">
                    Submit
                </Button>
            </form>
        </CenteredContainer>
    );
}
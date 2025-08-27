import Link from "next/link";
import create from "./actions";
import CenteredContainer from "@/components/organisms/CenteredContainer";
import Title from "@/components/atoms/texts/Title";
import InputGroup from "@/components/atoms/forms/InputGroup";
import Input from "@/components/atoms/forms/Input";
import TextArea from "@/components/atoms/forms/TextArea";
import Select from "@/components/atoms/forms/Select";
import Button from "@/components/atoms/buttons/Button";

export default function NewTask() {
    return (
        <CenteredContainer>
            <form action={create} className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-8 flex flex-col gap-6 border border-gray-700">
                <Title>Criar tarefa</Title>
                <InputGroup label={{ htmlFor: "title", text: "Título" }}>
                    <Input type="text" name="title" id="title" placeholder="Digite o título" />
                </InputGroup>
                <InputGroup label={{ htmlFor: "description", text: "Descrição" }}>
                    <TextArea name="description" id="description" placeholder="Digite a descrição" />
                </InputGroup>
                <InputGroup label={{ htmlFor: "dueDate", text: "Data de vencimento" }}>
                    <Input type="date" name="dueDate" id="dueDate" placeholder="Selecione a data de vencimento" />
                </InputGroup>
                <InputGroup label={{ htmlFor: "priority", text: "Prioridade" }}>
                    <Select options={[
                        { value: "low", label: "Baixa" },
                        { value: "medium", label: "Média" },
                        { value: "high", label: "Alta" }
                    ]} name="priority" id="priority" />
                </InputGroup>
                <Button type="submit">
                    Criar Tarefa
                </Button>
                <Link href="/">Voltar</Link>
            </form>
        </CenteredContainer>
    )
}
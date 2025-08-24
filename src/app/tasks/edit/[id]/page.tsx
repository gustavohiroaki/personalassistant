import Link from "next/link";
import { edit, getTask } from "./actions";
import { redirect } from "next/navigation";
import CenteredContainer from "@/components/organisms/CenteredContainer";
import Title from "@/components/atoms/texts/Title";
import Input from "@/components/atoms/forms/Input";
import TextArea from "@/components/atoms/forms/TextArea";
import Select from "@/components/atoms/forms/Select";
import InputGroup from "@/components/atoms/forms/InputGroup";
import Button from "@/components/atoms/Button";

export default async function EditTask({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [task] = await getTask(id);
    const datestring = new Date(task.dueDate).toISOString().split('T')[0];

    const handleSubmit = async (formData: FormData) => {
        'use server';
        await edit(formData, id);
        redirect('/tasks');
    };

    return (
        <CenteredContainer>
            <form action={handleSubmit} className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-8 flex flex-col gap-6 border border-gray-700">
                <Title>Editar tarefa</Title>
                <InputGroup label={{ htmlFor: "title", text: "Título" }}>
                    <Input defaultValue={task.title} type="text" name="title" id="title" placeholder="Digite o título" />
                </InputGroup>
                <InputGroup label={{ htmlFor: "description", text: "Descrição" }}>
                    <TextArea defaultValue={task.description} name="description" id="description" placeholder="Digite a descrição" />
                </InputGroup>
                <InputGroup label={{ htmlFor: "dueDate", text: "Data de vencimento" }}>
                    <Input defaultValue={datestring} type="date" name="dueDate" id="dueDate" placeholder="Selecione a data de vencimento" />
                </InputGroup>
                <InputGroup label={{ htmlFor: "priority", text: "Prioridade" }}>
                    <Select options={[
                        { value: "low", label: "Baixa" },
                        { value: "medium", label: "Média" },
                        { value: "high", label: "Alta" }
                    ]} defaultValue={task.priority} name="priority" id="priority" />
                </InputGroup>
                <Button type="submit">
                    Criar Tarefa
                </Button>
                <Link href="/">Voltar</Link>
            </form>
        </CenteredContainer>
    )
}
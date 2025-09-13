'use client'
import { ITask } from "@/entities/ITask";
import CloseButton from "../atoms/buttons/CloseButton";
import CardFooter from "../molecules/CardFooter";
import Card from "../organisms/Card";
import CenteredContainer from "../organisms/CenteredContainer";
import GridContainer from "../organisms/GridContainer";
import { ChangeEvent, useState } from "react";
import { patch, remove } from "@/app/tasks/actions";
import { redirect } from "next/navigation";
import Modal from "../atoms/Modal";
import MarkdownRenderer from "../atoms/MarkdownRenderer";
import Loading from "../atoms/Loading";
interface TasksPanelProps {
    initialTasks: ITask[]
}
export default function TasksPanel({ initialTasks }: TasksPanelProps) {
    const [tasks, setTasks] = useState(initialTasks)
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [modalContent, setModalContent] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const categories = [...new Set(initialTasks.map(task => task.category).filter(Boolean))] as string[];
    const filteredTasks = selectedCategory
        ? tasks.filter(task => task.category === selectedCategory)
        : tasks;
    const handleCloseButtonClick = (id: string) => {
        remove(id).then(() => {
            setTasks(tasks.filter(item => item.id !== id))
        })
    }
    const handleCheckboxChange = (id: string, event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: isChecked };
            }
            return task;
        });
        setTasks(updatedTasks);
        patch(id, { completed: isChecked }).catch(error => {
            console.error("Failed to update task status:", error);
        });
    };
    const handleCloseModal = () => {
        setModalOpen(!modalOpen);
    }
    const handleOpenModal = (task: ITask) => {
        setIsLoading(true)
        setModalOpen(true)
        fetch('/api/ai/explain', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                category: task.category
            })
        }).then(response => response.json()).then(data => {
            setModalContent(data.message)
            setIsLoading(false)
        })
    }
    return (
        <CenteredContainer justify="start">
            <div className="mb-4 flex flex-wrap gap-2">
                <button onClick={() => setSelectedCategory(null)} className={`px-3 py-1 rounded-full text-sm ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    Todas
                </button>
                {categories.map(category => (
                    <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                        {category}
                    </button>
                ))}
            </div>
            <GridContainer cols={2}>
                {filteredTasks.map(task => (
                    <Card key={task.id}>
                        <div>
                            <div className="flex flex-row justify-between items-start">
                                <div>
                                    <h1 className="text-3xl text-gray-100 mb-3 ">{task.title}</h1>
                                    {task.category && <p className="text-sm text-gray-400 bg-gray-700 rounded-full px-3 py-1 inline-block">{task.category}</p>}
                                </div>
                                <CloseButton onClick={() => task.id ? handleCloseButtonClick(task.id) : null} />
                            </div>
                            <p className="text-gray-200">{new Intl.DateTimeFormat("pt-BR", { timeZone: 'UTC' }).format(new Date(task.dueDate)).toString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-200 text-justify">{task.description}</p>
                        </div>
                        <CardFooter explainButtonAction={() => {
                            handleOpenModal(task)
                        }} editButtonAction={() => { redirect(`/tasks/edit/${task.id}`) }} taskStatus={task.completed} checkboxAction={(event: ChangeEvent<HTMLInputElement>) => task.id && handleCheckboxChange(task.id, event)} />
                    </Card>
                ))}
            </GridContainer>
            <Modal open={modalOpen} handleCloseModal={handleCloseModal}>
                {isLoading ? <Loading /> : <MarkdownRenderer content={modalContent} />}
            </Modal>
        </CenteredContainer>
    )
}
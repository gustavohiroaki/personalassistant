'use client'

import { ITaskDb } from "@/entities/ITask";
import CloseButton from "../atoms/CloseButton";
import CardFooter from "../molecules/CardFooter";
import Card from "../organisms/Card";
import CenteredContainer from "../organisms/CenteredContainer";
import GridContainer from "../organisms/GridContainer";
import { useState } from "react";
import { remove } from "@/app/tasks/actions";

interface TasksPanelProps {
    initialTasks: ITaskDb[]
}

export default function TasksPanel({ initialTasks }: TasksPanelProps) {
    const [tasks, setTasks] = useState(initialTasks)

    const handleCloseButtonClick = (id: string) => {
        remove(id).then(() => {
            setTasks(tasks.filter(item => item.id !== id))
        })
    }

    return (
        <CenteredContainer justify="start">
            <GridContainer cols={2}>
                {tasks.map(task => (
                    <Card key={task.id}>
                        <div>
                            <div className="flex flex-row justify-between items-start">
                                <h1 className="text-3xl text-gray-100 mb-3 ">{task.title}</h1>
                                <CloseButton onClick={() => handleCloseButtonClick(task.id)} />
                            </div>
                            <p className="text-gray-200">{new Intl.DateTimeFormat("pt-BR", { timeZone: 'UTC' }).format(new Date(task.dueDate)).toString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-200 text-justify">{task.description}</p>
                        </div>
                        <CardFooter explainButtonAction={() => { }} editButtonAction={() => { }} checkboxAction={() => { }} />
                    </Card>
                ))}
            </GridContainer>
        </CenteredContainer>
    )
}
"use client";

import { useState, useEffect } from "react";
import { IRoutineOutput } from "@/@core/domain/entities/routine.entity";
import Card from "@/components/organisms/Card";
import GridContainer from "@/components/organisms/GridContainer";
import CenteredContainer from "@/components/organisms/CenteredContainer";
import Title from "@/components/atoms/texts/Title";
import Button from "@/components/atoms/buttons/Button";
import RedirectButton from "@/components/atoms/buttons/RedirectButton";
import Loading from "@/components/atoms/Loading";
import {
    PlusIcon,
    RoutineIcon,
    EditIcon,
    DeleteIcon,
    ToggleOnIcon,
    ToggleOffIcon,
    ArrowLeftIcon,
    CalendarIcon,
    ClockIcon
} from "@/components/atoms/icons/Icons";

export default function RoutinesPage() {
    const [routines, setRoutines] = useState<IRoutineOutput[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/routines");
            if (!response.ok) {
                throw new Error("Erro ao carregar rotinas");
            }
            const data = await response.json();
            setRoutines(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoutine = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta rotina?")) {
            return;
        }

        try {
            const response = await fetch(`/api/routines/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir rotina");
            }

            setRoutines(routines.filter((routine) => routine.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao excluir");
        }
    };

    const handleToggleActive = async (id: string, currentActive: boolean) => {
        try {
            const response = await fetch(`/api/routines/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    active: !currentActive,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar rotina");
            }

            const updatedRoutine = await response.json();
            setRoutines(
                routines.map((routine) =>
                    routine.id === id ? updatedRoutine : routine
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar");
        }
    };

    const getFrequencyLabel = (frequency: string) => {
        const labels: Record<string, string> = {
            once: "Uma vez",
            daily: "Diário",
            weekly: "Semanal",
            monthly: "Mensal",
            yearly: "Anual",
            custom: "Personalizado",
        };
        return labels[frequency] || frequency;
    };

    const getFrequencyColor = (frequency: string) => {
        const colors: Record<string, string> = {
            once: "bg-gray-700 text-gray-200",
            daily: "bg-blue-700 text-blue-200",
            weekly: "bg-green-700 text-green-200",
            monthly: "bg-purple-700 text-purple-200",
            yearly: "bg-yellow-700 text-yellow-200",
            custom: "bg-pink-700 text-pink-200",
        };
        return colors[frequency] || "bg-gray-700 text-gray-200";
    };

    const categories = [...new Set(routines.map(routine => routine.category).filter(Boolean))] as string[];

    const filteredRoutines = selectedCategory
        ? routines.filter(routine => routine.category === selectedCategory)
        : routines;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <Loading />
                    <p className="mt-4 text-gray-300">Carregando rotinas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
                <CenteredContainer>
                    <Card variant="elevated" className="text-center">
                        <div className="text-red-400">
                            <p className="text-lg font-semibold mb-2">Ops! Algo deu errado</p>
                            <p className="mb-4">{error}</p>
                            <Button onClick={fetchRoutines} variant="primary">
                                Tentar novamente
                            </Button>
                        </div>
                    </Card>
                </CenteredContainer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <RedirectButton href="/" variant="outline" size="sm" icon={<ArrowLeftIcon />}>
                            Voltar
                        </RedirectButton>
                        <div className="ml-4">
                            <Title>Minhas Rotinas</Title>
                            <p className="text-gray-300 mt-1">Gerencie suas rotinas diárias, semanais e mensais</p>
                        </div>
                    </div>
                    <RedirectButton href="/routines/new" variant="primary" icon={<PlusIcon />}>
                        Nova Rotina
                    </RedirectButton>
                </div>

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

                {filteredRoutines.length === 0 ? (
                    <div className="text-center py-16">
                        <Card variant="elevated" className="max-w-md mx-auto">
                            <div className="text-center">
                                <RoutineIcon className="mx-auto mb-4 w-16 h-16 text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-100 mb-2">Nenhuma rotina encontrada</h3>
                                <p className="text-gray-300 mb-6">Crie uma nova rotina ou limpe os filtros.</p>
                                <RedirectButton href="/routines/new" variant="primary" fullWidth icon={<PlusIcon />}>
                                    Criar rotina
                                </RedirectButton>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <GridContainer cols={3} gap={6}>
                        {filteredRoutines.map((routine) => (
                            <Card key={routine.id} variant="elevated" className="hover:scale-105 transition-transform">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-2">
                                            <RoutineIcon className="text-blue-400" />
                                            <h3 className="text-lg font-semibold text-gray-100 truncate">{routine.title}</h3>
                                            {routine.category && <span className="text-xs bg-gray-600 text-gray-200 px-2 py-1 rounded-full">{routine.category}</span>}
                                        </div>
                                        <div
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${routine.active
                                                ? "bg-green-700 text-green-200"
                                                : "bg-gray-700 text-gray-200"
                                                }`}
                                        >
                                            {routine.active ? "Ativa" : "Inativa"}
                                        </div>
                                    </div>

                                    {routine.description && (
                                        <p className="text-gray-300 text-sm line-clamp-2">{routine.description}</p>
                                    )}

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <ClockIcon className="w-4 h-4 text-gray-400" />
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(routine.frequency)}`}>
                                                {getFrequencyLabel(routine.frequency)}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-300">
                                                Início: {new Date(routine.startDate).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>

                                        {routine.endDate && (
                                            <div className="flex items-center space-x-2">
                                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-300">
                                                    Fim: {new Date(routine.endDate).toLocaleDateString("pt-BR")}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-700">
                                        <RedirectButton
                                            href={`/routines/edit/${routine.id}`}
                                            variant="outline"
                                            size="sm"
                                            fullWidth
                                        >
                                            <EditIcon />
                                        </RedirectButton>

                                        <Button
                                            onClick={() =>
                                                handleToggleActive(routine.id, routine.active)
                                            }
                                            variant={routine.active ? "warning" : "success"}
                                            size="sm"
                                            fullWidth
                                        >
                                            {routine.active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                                        </Button>

                                        <Button
                                            onClick={() => handleDeleteRoutine(routine.id)}
                                            variant="danger"
                                            size="sm"
                                            fullWidth
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </GridContainer>
                )}
            </div>
        </div>
    );
}
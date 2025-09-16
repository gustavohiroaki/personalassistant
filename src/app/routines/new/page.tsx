"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IRoutineInput } from "@/@core/domain/entities/routine.entity";
import Card from "@/components/organisms/Card";
import Title from "@/components/atoms/texts/Title";
import Button from "@/components/atoms/buttons/Button";
import RedirectButton from "@/components/atoms/buttons/RedirectButton";
import Input from "@/components/atoms/forms/Input";
import TextArea from "@/components/atoms/forms/TextArea";
import Select from "@/components/atoms/forms/Select";
import Label from "@/components/atoms/forms/Label";
import { ArrowLeftIcon } from "@/components/atoms/icons/Icons";
export default function NewRoutinePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<IRoutineInput>>({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        frequency: "daily",
        startDate: new Date(),
        active: true,
        daysOfWeek: [],
    });
    const handleInputChange = (
        field: keyof IRoutineInput,
        value: string | boolean | Date | number | number[]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleDaysOfWeekChange = (day: number) => {
        const currentDays = formData.daysOfWeek || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter((d) => d !== day)
            : [...currentDays, day];
        setFormData((prev) => ({
            ...prev,
            daysOfWeek: newDays,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.frequency || !formData.startDate || !formData.priority) {
            setError("Título, frequência, prioridade e data de início são obrigatórios");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/routines", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error("Erro ao criar rotina");
            }
            router.push("/routines");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };
    const weekDays = [
        { value: 0, label: "Domingo" },
        { value: 1, label: "Segunda" },
        { value: 2, label: "Terça" },
        { value: 3, label: "Quarta" },
        { value: 4, label: "Quinta" },
        { value: 5, label: "Sexta" },
        { value: 6, label: "Sábado" },
    ];
    const frequencyOptions = [
        { value: "once", label: "Uma vez" },
        { value: "daily", label: "Diário" },
        { value: "weekly", label: "Semanal" },
        { value: "monthly", label: "Mensal" },
        { value: "yearly", label: "Anual" },
        { value: "custom", label: "Personalizado" },
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center mb-8">
                        <RedirectButton href="/routines" variant="outline" size="sm" icon={<ArrowLeftIcon />}>
                            Voltar
                        </RedirectButton>
                        <div className="ml-4">
                            <Title>Nova Rotina</Title>
                            <p className="text-gray-300 mt-1">Crie uma nova rotina para organizar seu dia</p>
                        </div>
                    </div>
                    <Card variant="elevated" className="shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-900 border-l-4 border-red-500 text-red-200 px-4 py-3 rounded">
                                    <div className="flex items-center">
                                        <span className="font-medium">Erro:</span>
                                        <span className="ml-2">{error}</span>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Label htmlFor="title">Título *</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={formData.title || ""}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        placeholder="Ex: Exercícios matinais"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="description">Descrição</Label>
                                    <TextArea
                                        id="description"
                                        value={formData.description || ""}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        placeholder="Descreva a rotina..."
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="category">Categoria</Label>
                                    <Input
                                        id="category"
                                        type="text"
                                        value={formData.category || ""}
                                        onChange={(e) => handleInputChange("category", e.target.value)}
                                        placeholder="Ex: Trabalho, Pessoal"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="priority">Prioridade *</Label>
                                    <Select
                                        id="priority"
                                        value={formData.priority || "medium"}
                                        onChange={(e) => handleInputChange("priority", e.target.value)}
                                        options={[
                                            { value: "low", label: "Baixa" },
                                            { value: "medium", label: "Média" },
                                            { value: "high", label: "Alta" }
                                        ]}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="frequency">Frequência *</Label>
                                    <Select
                                        id="frequency"
                                        value={formData.frequency || "daily"}
                                        onChange={(e) => handleInputChange("frequency", e.target.value)}
                                        options={frequencyOptions}
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-2 pt-6">
                                    <input
                                        id="active"
                                        type="checkbox"
                                        checked={formData.active || false}
                                        onChange={(e) => handleInputChange("active", e.target.checked)}
                                        className="rounded"
                                    />
                                    <Label htmlFor="active">Rotina ativa</Label>
                                </div>
                            </div>
                            {formData.frequency === "weekly" && (
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                    <Label>Dias da semana</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                        {weekDays.map((day) => (
                                            <label
                                                key={day.value}
                                                className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-700 text-gray-200"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.daysOfWeek?.includes(day.value) || false}
                                                    onChange={() => handleDaysOfWeekChange(day.value)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">{day.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {formData.frequency === "monthly" && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <Label htmlFor="dayOfMonth">Dia do mês</Label>
                                    <Input
                                        id="dayOfMonth"
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={formData.dayOfMonth || ""}
                                        onChange={(e) => handleInputChange("dayOfMonth", parseInt(e.target.value))}
                                        placeholder="Ex: 15"
                                    />
                                </div>
                            )}
                            {formData.frequency === "yearly" && (
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="month">Mês</Label>
                                            <Input
                                                id="month"
                                                type="number"
                                                min="1"
                                                max="12"
                                                value={formData.month || ""}
                                                onChange={(e) => handleInputChange("month", parseInt(e.target.value))}
                                                placeholder="Ex: 12"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dayOfMonth">Dia</Label>
                                            <Input
                                                id="dayOfMonth"
                                                type="number"
                                                min="1"
                                                max="31"
                                                value={formData.dayOfMonth || ""}
                                                onChange={(e) => handleInputChange("dayOfMonth", parseInt(e.target.value))}
                                                placeholder="Ex: 25"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startDate">Data de início *</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ""}
                                        onChange={(e) => handleInputChange("startDate", new Date(e.target.value))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endDate">Data de fim (opcional)</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleInputChange("endDate", value ? new Date(value) : new Date());
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                >
                                    {loading ? "Criando..." : "Criar Rotina"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => router.push("/routines")}
                                    variant="secondary"
                                    size="lg"
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}

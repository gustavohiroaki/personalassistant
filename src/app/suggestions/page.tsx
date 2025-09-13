"use client";
import { useState, useEffect, useCallback } from "react";
import Card from "@/components/organisms/Card";
import Button from "@/components/atoms/buttons/Button";
import Loading from "@/components/atoms/Loading";
import Input from "@/components/atoms/forms/Input";
import Label from "@/components/atoms/forms/Label";
interface Activity {
    id?: string;
    type: "task" | "routine" | "break" | "suggestion";
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    estimatedDuration: number;
    category?: string;
}
interface HourlyPlan {
    timeSlot: string;
    activities: Activity[];
}
interface DaySuggestion {
    date: string;
    summary: {
        totalTasks: number;
        totalRoutines: number;
        highPriorityTasks: number;
        estimatedWorkHours: number;
    };
    hourlyPlan: HourlyPlan[];
    tips: string[];
    motivationalMessage: string;
}
interface UserPreferences {
    workStartTime: string;
    workEndTime: string;
    wakeUpTime: string;
    sleepTime: string;
    focusAreas: string[];
    currentEnergy: number;
    availableTime: number;
}
export default function DaySuggestionsPage() {
    const [suggestions, setSuggestions] = useState<DaySuggestion | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState<UserPreferences>({
        workStartTime: "09:00",
        workEndTime: "17:00",
        wakeUpTime: "06:00",
        sleepTime: "22:00",
        focusAreas: ["programação", "estudos"],
        currentEnergy: 7,
        availableTime: 8,
    });
    const fetchSuggestions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                date: selectedDate,
                workStartTime: preferences.workStartTime,
                workEndTime: preferences.workEndTime,
                wakeUpTime: preferences.wakeUpTime,
                sleepTime: preferences.sleepTime,
                focusAreas: preferences.focusAreas.join(","),
                currentEnergy: preferences.currentEnergy.toString(),
                availableTime: preferences.availableTime.toString(),
            });
            const response = await fetch(`/api/ai/suggest-tasks?${params}`);
            if (!response.ok) {
                throw new Error("Erro ao buscar sugestões");
            }
            const data = await response.json();
            setSuggestions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }, [selectedDate, preferences]);
    const refreshSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/ai/suggest-tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    targetDate: selectedDate,
                    workStartTime: preferences.workStartTime,
                    workEndTime: preferences.workEndTime,
                    wakeUpTime: preferences.wakeUpTime,
                    sleepTime: preferences.sleepTime,
                    focusAreas: preferences.focusAreas,
                    currentEnergy: preferences.currentEnergy,
                    availableTime: preferences.availableTime,
                }),
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar sugestões");
            }
            const data = await response.json();
            setSuggestions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);
    const getActivityIcon = (type: Activity["type"]) => {
        switch (type) {
            case "task":
                return "✅";
            case "routine":
                return "🔄";
            case "break":
                return "☕";
            case "suggestion":
                return "💡";
            default:
                return "📝";
        }
    };
    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case "high":
                return "border-l-red-500 bg-red-900 bg-opacity-50";
            case "medium":
                return "border-l-yellow-500 bg-yellow-900 bg-opacity-50";
            case "low":
                return "border-l-green-500 bg-green-900 bg-opacity-50";
            default:
                return "border-l-gray-500 bg-gray-800 bg-opacity-50";
        }
    };
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-6xl mx-auto">
                {}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Sugestões do Dia
                    </h1>
                    <p className="text-gray-300">
                        Otimize sua produtividade com um plano personalizado
                    </p>
                </div>
                {}
                <Card className="mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="date">Data:</Label>
                            <Input
                                id="date"
                                type="date"
                                value={selectedDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                                className="w-auto"
                            />
                        </div>
                        <Button onClick={fetchSuggestions} disabled={loading}>
                            {loading ? "Carregando..." : "Gerar Sugestões"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setShowPreferences(!showPreferences)}
                        >
                            Preferências
                        </Button>
                        {suggestions && (
                            <Button variant="outline" onClick={refreshSuggestions} disabled={loading}>
                                Atualizar
                            </Button>
                        )}
                    </div>
                    {}
                    {showPreferences && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                            <h3 className="text-lg font-semibold mb-3 text-white">Configurações do Dia</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="wakeUpTime">Horário de acordar:</Label>
                                    <Input
                                        id="wakeUpTime"
                                        type="time"
                                        value={preferences.wakeUpTime}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setPreferences({
                                                ...preferences,
                                                wakeUpTime: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="sleepTime">Horário de dormir:</Label>
                                    <Input
                                        id="sleepTime"
                                        type="time"
                                        value={preferences.sleepTime}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setPreferences({
                                                ...preferences,
                                                sleepTime: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="workStart">Início do trabalho:</Label>
                                    <Input
                                        id="workStart"
                                        type="time"
                                        value={preferences.workStartTime}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setPreferences({
                                                ...preferences,
                                                workStartTime: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="workEnd">Fim do trabalho:</Label>
                                    <Input
                                        id="workEnd"
                                        type="time"
                                        value={preferences.workEndTime}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setPreferences({
                                                ...preferences,
                                                workEndTime: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="currentEnergy">Nível de energia (1-10):</Label>
                                    <Input
                                        id="currentEnergy"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={preferences.currentEnergy}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setPreferences({
                                                ...preferences,
                                                currentEnergy: parseInt(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="availableTime">Tempo disponível (horas):</Label>
                                    <Input
                                        id="availableTime"
                                        type="number"
                                        min="1"
                                        max="16"
                                        value={preferences.availableTime}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setPreferences({
                                                ...preferences,
                                                availableTime: parseInt(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Label htmlFor="focusAreas">Áreas de foco (separadas por vírgula):</Label>
                                <Input
                                    id="focusAreas"
                                    type="text"
                                    value={preferences.focusAreas.join(", ")}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setPreferences({
                                            ...preferences,
                                            focusAreas: e.target.value.split(",").map(area => area.trim()).filter(area => area),
                                        })
                                    }
                                    placeholder="Ex: programação, estudos, exercícios"
                                />
                            </div>
                        </div>
                    )}
                </Card>
                {}
                {error && (
                    <Card className="mb-6 border-red-600 bg-red-900">
                        <div className="text-red-300">
                            <h3 className="font-semibold">Erro ao carregar sugestões</h3>
                            <p>{error}</p>
                        </div>
                    </Card>
                )}
                {}
                {loading && (
                    <Card className="text-center py-8">
                        <Loading />
                        <p className="mt-2 text-gray-300">Gerando sugestões personalizadas...</p>
                    </Card>
                )}
                {}
                {suggestions && !loading && (
                    <div className="space-y-6">
                        {}
                        <Card>
                            <h2 className="text-xl font-bold mb-4 text-white">
                                {formatDate(suggestions.date)}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="text-center p-3 bg-blue-900 rounded-lg border border-blue-800">
                                    <div className="text-2xl font-bold text-blue-300">
                                        {suggestions.summary.totalTasks}
                                    </div>
                                    <div className="text-sm text-blue-400">Tarefas</div>
                                </div>
                                <div className="text-center p-3 bg-green-900 rounded-lg border border-green-800">
                                    <div className="text-2xl font-bold text-green-300">
                                        {suggestions.summary.totalRoutines}
                                    </div>
                                    <div className="text-sm text-green-400">Rotinas</div>
                                </div>
                                <div className="text-center p-3 bg-red-900 rounded-lg border border-red-800">
                                    <div className="text-2xl font-bold text-red-300">
                                        {suggestions.summary.highPriorityTasks}
                                    </div>
                                    <div className="text-sm text-red-400">Alta Prioridade</div>
                                </div>
                                <div className="text-center p-3 bg-purple-900 rounded-lg border border-purple-800">
                                    <div className="text-2xl font-bold text-purple-300">
                                        {suggestions.summary.estimatedWorkHours}h
                                    </div>
                                    <div className="text-sm text-purple-400">Horas Estimadas</div>
                                </div>
                            </div>
                            {}
                            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-lg border border-blue-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">💪</span>
                                    <h3 className="font-semibold text-white">Mensagem do Dia</h3>
                                </div>
                                <p className="text-gray-300">{suggestions.motivationalMessage}</p>
                            </div>
                        </Card>
                        {}
                        <Card>
                            <h3 className="text-lg font-semibold mb-3 text-white">💡 Dicas para Hoje</h3>
                            <ul className="space-y-2">
                                {suggestions.tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-yellow-400 mt-1">•</span>
                                        <span className="text-gray-300">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        {}
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-white">📅 Cronograma do Dia</h3>
                            <div className="space-y-3">
                                {suggestions.hourlyPlan.map((slot, index) => (
                                    <Card key={index} className="border-l-4 border-l-blue-500">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-lg font-semibold text-blue-300">
                                                {slot.timeSlot}
                                            </h4>
                                            <span className="text-sm text-gray-400">
                                                {slot.activities.length} atividade(s)
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {slot.activities.map((activity, actIndex) => (
                                                <div
                                                    key={actIndex}
                                                    className={`p-3 rounded-lg border-l-4 ${getPriorityColor(
                                                        activity.priority
                                                    )}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-xl">
                                                            {getActivityIcon(activity.type)}
                                                        </span>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h5 className="font-semibold text-white">
                                                                    {activity.title}
                                                                </h5>
                                                                {activity.priority && (
                                                                    <span
                                                                        className={`px-2 py-1 text-xs rounded-full ${activity.priority === "high"
                                                                                ? "bg-red-800 text-red-300 border border-red-700"
                                                                                : activity.priority === "medium"
                                                                                    ? "bg-yellow-800 text-yellow-300 border border-yellow-700"
                                                                                    : "bg-green-800 text-green-300 border border-green-700"
                                                                            }`}
                                                                    >
                                                                        {activity.priority.toUpperCase()}
                                                                    </span>
                                                                )}
                                                                {activity.category && (
                                                                    <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                                                                        {activity.category}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {activity.description && (
                                                                <p className="text-gray-300 text-sm mb-2">
                                                                    {activity.description}
                                                                </p>
                                                            )}
                                                            <div className="text-xs text-gray-400">
                                                                ⏱️ {activity.estimatedDuration} minutos
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {}
                {!suggestions && !loading && !error && (
                    <Card className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                            <span className="text-4xl">📅</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Nenhuma sugestão carregada
                        </h3>
                        <p className="text-gray-300 mb-4">
                            Clique em &ldquo;Gerar Sugestões&rdquo; para começar
                        </p>
                        <Button onClick={fetchSuggestions}>Gerar Sugestões</Button>
                    </Card>
                )}
            </div>
        </div>
    );
}

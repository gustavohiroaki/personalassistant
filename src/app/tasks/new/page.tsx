import Link from "next/link";
import create from "./actions";

export default function NewTask() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <form action={create} className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-8 flex flex-col gap-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-100">Nova Tarefa</h2>
                <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="font-medium text-gray-200">Título</label>
                    <input type="text" name="title" id="title" className="border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" placeholder="Digite o título" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="font-medium text-gray-200">Descrição</label>
                    <textarea name="description" id="description" className="border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[80px] placeholder-gray-400" placeholder="Digite a descrição" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="dueDate" className="font-medium text-gray-200">Data de vencimento</label>
                    <input type="date" name="dueDate" id="dueDate" className="border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="priority" className="font-medium text-gray-200">Prioridade</label>
                    <select name="priority" id="priority" className="border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-semibold mt-2">
                    Criar Tarefa
                </button>
                <Link href="/">Voltar</Link>
            </form>
        </div>
    )
}
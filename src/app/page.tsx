import Link from "next/link";

export default function Home() {
  return (
    <main className="h-full flex flex-col justify-center items-center gap-10">
      <h1 className="text-3xl">Personal Assistant</h1>
      <div className="grid grid-cols-2">
        <Link href="/tasks/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Cadastrar
        </Link>
        <Link href="/tasks" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors ml-2">
          Minhas tarefas
        </Link>
      </div>
    </main>
  );
}

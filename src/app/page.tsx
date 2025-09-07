import RedirectButton from "@/components/atoms/buttons/RedirectButton";
import Title from "@/components/atoms/texts/Title";
import CenteredContainer from "@/components/organisms/CenteredContainer";
import GridContainer from "@/components/organisms/GridContainer";
import { TaskIcon, RoutineIcon, CalendarIcon, PlusIcon } from "@/components/atoms/icons/Icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <CenteredContainer>
        <div className="text-center mb-8">
          <Title>Personal Assistant</Title>
          <p className="text-gray-300 mt-2 text-lg">Organize suas tarefas e rotinas de forma inteligente</p>
        </div>

        <GridContainer cols={2} gap={4}>
          <div className="space-y-4">
            <div className="space-y-3">
              <RedirectButton href="/tasks/new" variant="primary" fullWidth icon={<PlusIcon />}>
                Nova Tarefa
              </RedirectButton>
              <RedirectButton href="/tasks" variant="outline" fullWidth icon={<TaskIcon />}>
                Minhas Tarefas
              </RedirectButton>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <RedirectButton href="/routines/new" variant="success" fullWidth icon={<PlusIcon />}>
                Nova Rotina
              </RedirectButton>
              <RedirectButton href="/routines" variant="outline" fullWidth icon={<RoutineIcon />}>
                Minhas Rotinas
              </RedirectButton>
            </div>
          </div>
        </GridContainer>

        <div className="mt-8 text-center">
          <RedirectButton href="/day" variant="primary" size="lg" icon={<CalendarIcon />}>
            Planejar Meu Dia
          </RedirectButton>
        </div>
      </CenteredContainer>
    </div>
  );
}

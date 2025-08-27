import RedirectButton from "@/components/atoms/buttons/RedirectButton";
import Title from "@/components/atoms/texts/Title";
import CenteredContainer from "@/components/organisms/CenteredContainer";
import GridContainer from "@/components/organisms/GridContainer";

export default function Home() {
  return (
    <CenteredContainer>
      <Title>Personal Assistant</Title>
      <GridContainer cols={2}>
        <RedirectButton href="/tasks/new" theme="blue">
          Cadastrar
        </RedirectButton>
        <RedirectButton href="/tasks" theme="gray">
          Minhas tarefas
        </RedirectButton>
      </GridContainer>
    </CenteredContainer>
  );
}

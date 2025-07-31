import Link from "@/components/atoms/Link";
import Title from "@/components/atoms/texts/Title";
import CenteredContainer from "@/components/organisms/CenteredContainer";
import GridContainer from "@/components/organisms/GridContainer";

export default function Home() {
  return (
    <CenteredContainer>
      <Title>Personal Assistant</Title>
      <GridContainer cols={2}>
        <Link href="/tasks/new" theme="blue">
          Cadastrar
        </Link>
        <Link href="/tasks" theme="gray">
          Minhas tarefas
        </Link>
      </GridContainer>
    </CenteredContainer>
  );
}

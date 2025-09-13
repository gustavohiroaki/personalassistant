# O que é o Personal Assistant?

O **Personal Assistant** é uma aplicação web full-stack desenvolvida para auxiliar usuários no gerenciamento de suas tarefas diárias, rotinas e planejamento, utilizando inteligência artificial para oferecer sugestões e insights.

## Principais Funcionalidades

- **Gerenciamento de Tarefas (Tasks):** Permite criar, visualizar, editar e deletar tarefas.
- **Gerenciamento de Rotinas (Routines):** Possibilita a criação de rotinas que agrupam tarefas recorrentes.
- **Planejamento Diário com IA:** Um dos recursos centrais é a capacidade de gerar um "Plano do Dia" (`Day Plan`) de forma inteligente, sugerindo uma organização para as atividades do usuário.
- **Sugestões de Tarefas com IA:** A aplicação pode sugerir novas tarefas com base em prompts ou no contexto do usuário, facilitando o brainstorming e a organização.
- **Explicações com IA:** Funcionalidade que permite obter explicações ou detalhamentos sobre determinados tópicos, integrada à API da OpenAI.

## Arquitetura e Tecnologias

O projeto é construído com uma arquitetura moderna e robusta, separando claramente as responsabilidades em diferentes camadas, inspirada em princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**.

### Tecnologias Principais:

- **Framework:** [Next.js](https://nextjs.org/) (utilizando React para o frontend e Node.js para o backend com API Routes).
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/).
- **Banco de Dados:** [SQLite](https://www.sqlite.org/index.html), acessado através de uma camada de repositório.
- **Inteligência Artificial:** Integração com a API da [OpenAI](https://openai.com/) para as funcionalidades inteligentes.
- **Testes:** [Jest](https://jestjs.io/) para testes unitários.

### Estrutura de Diretórios:

- **`src/app`:** Contém a aplicação Next.js (App Router).
  - **`api/`:** Define os endpoints do backend (API Routes) que o frontend consome.
  - **`(pages)/`:** As diferentes páginas/rotas da aplicação (ex: `/tasks`, `/routines`, `/day`).
- **`src/components`:** Componentes React reutilizáveis, organizados seguindo uma abordagem de Atomic Design (`atoms`, `molecules`, `organisms`).
- **`src/@core`:** O coração da aplicação, onde a lógica de negócio reside. É dividido em:
  - **`domain`:** Contém as entidades de negócio (`Task`, `Routine`), agregados e as interfaces dos repositórios. É a camada mais interna e pura da aplicação.
  - **`application`:** Orquestra o fluxo de dados e executa os casos de uso (use cases), como `GenerateDayPlanUseCase` ou `CreateTaskUseCase`.
  - **`infrastructure`:** Implementações concretas das interfaces definidas no domínio. Aqui encontramos o cliente da OpenAI (`client.openai.ts`) e as implementações dos repositórios para SQLite.
- **`src/__tests__`:** Testes unitários para as entidades de domínio e a lógica da aplicação.

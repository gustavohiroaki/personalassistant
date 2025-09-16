# 🚀 GitHub Actions & Docker Setup

Este projeto inclui automação completa de CI/CD com GitHub Actions e DockerHub.

## 📋 Workflows Configurados

### 1. 🏗️ Build e Push Docker (`docker-build-push.yml`)

- **Trigger**: Push para `main`/`develop`, Tags `v*`, Pull Requests
- **Funcionalidade**: Build da aplicação e push para DockerHub
- **Plataformas**: `linux/amd64`, `linux/arm64`
- **Cache**: Otimizado com GitHub Actions Cache

### 2. 🧪 CI Tests (`ci.yml`)

- **Trigger**: Push e Pull Requests
- **Funcionalidade**: Testes, lint e build
- **Node.js**: Versões 18.x e 20.x
- **Docker**: Teste de build local

### 3. 🎯 Release (`release.yml`)

- **Trigger**: Tags `v*`
- **Funcionalidade**: Release automático + Docker push
- **Changelog**: Geração automática
- **GitHub Releases**: Criação automática

## ⚙️ Configuração Necessária

### 1. Secrets do GitHub

Adicione em `Settings` → `Secrets and variables` → `Actions`:

```bash
DOCKERHUB_USERNAME=seuusuario
DOCKERHUB_TOKEN=seu_token_aqui
```

### 2. Como obter o Token do DockerHub

1. Acesse [DockerHub](https://hub.docker.com)
2. `Account Settings` → `Security` → `New Access Token`
3. Nome: "GitHub Actions"
4. Permissões: `Read, Write, Delete`
5. Copie o token gerado

## 🎮 Como Usar

### Desenvolvimento

```bash
# Build local
docker build -t personalassistant .

# Executar local
docker-compose up

# Testes
npm test
npm run lint
```

### Release Automático

```bash
# Usando o script
./scripts/release.sh patch   # 1.0.0 → 1.0.1
./scripts/release.sh minor   # 1.0.0 → 1.1.0
./scripts/release.sh major   # 1.0.0 → 2.0.0

# Manual
git tag v1.0.1
git push origin v1.0.1
```

### Pull da Imagem Docker

```bash
# Última versão
docker pull seuusuario/personalassistant:latest

# Versão específica
docker pull seuusuario/personalassistant:v1.0.1

# Branch develop
docker pull seuusuario/personalassistant:develop
```

## 📊 Tags Geradas

| Trigger        | Tag                       | Exemplo   |
| -------------- | ------------------------- | --------- |
| Push `main`    | `latest`, `main`          | `latest`  |
| Push `develop` | `develop`                 | `develop` |
| Tag `v1.0.1`   | `v1.0.1`, `1.0`, `latest` | `v1.0.1`  |
| PR #123        | `pr-123`                  | `pr-123`  |

## 🔧 Troubleshooting

### ❌ "authentication required"

- Verifique `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN`

### ❌ "repository does not exist"

- Crie o repositório no DockerHub primeiro
- Verifique o nome do usuário

### ❌ Build falha

```bash
# Teste local
docker build -t test .
npm run build
npm run lint
```

## 📈 Status Badges

Adicione no README:

```markdown
![Docker Build](https://github.com/seuusuario/personalassistant/actions/workflows/docker-build-push.yml/badge.svg)
![CI Tests](https://github.com/seuusuario/personalassistant/actions/workflows/ci.yml/badge.svg)
```

## 🎯 Próximos Passos

1. ✅ Configure os secrets no GitHub
2. ✅ Faça push para testar o workflow
3. ✅ Crie sua primeira release com `./scripts/release.sh patch`
4. ✅ Verifique a imagem no DockerHub

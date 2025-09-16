# GitHub Actions - Docker Build & Push

Este workflow automatiza o build e push da aplicação Personal Assistant para o DockerHub.

## 🔧 Configuração Necessária

### 1. Secrets do DockerHub

Configure os seguintes secrets no seu repositório GitHub:

1. Vá para: `Settings` → `Secrets and variables` → `Actions`
2. Adicione os seguintes secrets:

#### `DOCKERHUB_USERNAME`
- **Valor**: Seu nome de usuário do DockerHub
- **Exemplo**: `seunome`

#### `DOCKERHUB_TOKEN`
- **Valor**: Token de acesso do DockerHub
- **Como obter**:
  1. Faça login no [DockerHub](https://hub.docker.com)
  2. Vá para `Account Settings` → `Security`
  3. Clique em `New Access Token`
  4. Dê um nome descritivo (ex: "GitHub Actions")
  5. Selecione permissões `Read, Write, Delete`
  6. Copie o token gerado

### 2. Como o Workflow Funciona

#### Triggers (Quando executa):
- ✅ **Push para `main`**: Build e push para DockerHub
- ✅ **Push para `develop`**: Build e push para DockerHub  
- ✅ **Tags `v*`**: Build e push com tag da versão
- ✅ **Pull Requests**: Apenas build (não faz push)

#### Tags geradas automaticamente:
- `latest` - sempre a versão mais recente da branch main
- `main` - última versão da branch main
- `develop` - última versão da branch develop
- `v1.0.0` - quando criar tag de versão
- `pr-123` - para pull requests

#### Exemplos de imagens geradas:
```bash
# Branch main
seunome/personalassistant:latest
seunome/personalassistant:main

# Branch develop  
seunome/personalassistant:develop

# Tag de versão
seunome/personalassistant:v1.0.0
seunome/personalassistant:1.0

# Pull Request
seunome/personalassistant:pr-123
```

### 3. Executar a Aplicação

Após o build, você pode executar a aplicação com:

```bash
# Versão mais recente
docker run -p 3000:3000 seunome/personalassistant:latest

# Versão específica
docker run -p 3000:3000 seunome/personalassistant:v1.0.0
```

### 4. Status do Build

O status do build aparecerá:
- ✅ Na aba `Actions` do GitHub
- ✅ No README se adicionar badge
- ✅ Nos commits como check

### 5. Recursos do Workflow

- 🚀 **Multi-platform**: Suporta `linux/amd64` e `linux/arm64`
- ⚡ **Cache**: Usa cache do GitHub para builds mais rápidos
- 🔒 **Seguro**: Não faz push em Pull Requests
- 📦 **Otimizado**: Dockerfile multi-stage para imagens menores
- 🏷️ **Versionamento**: Tags automáticas baseadas em branches e versões

## 🐛 Troubleshooting

### Erro: "authentication required"
- ✅ Verifique se os secrets `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` estão configurados corretamente

### Erro: "repository does not exist"
- ✅ Certifique-se que o repositório existe no DockerHub
- ✅ Verifique se o nome de usuário está correto

### Build falha
- ✅ Teste o build localmente: `docker build -t test .`
- ✅ Verifique se todos os arquivos necessários estão commitados

## 📝 Exemplo de Badge

Adicione no seu README.md:

```markdown
![Docker Build](https://github.com/seunome/personalassistant/actions/workflows/docker-build-push.yml/badge.svg)
```

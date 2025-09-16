#!/bin/bash

# Script para criar uma nova versão e tag
# Uso: ./scripts/release.sh [patch|minor|major]

set -e

# Verificar se está na branch main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "❌ Erro: Releases devem ser feitas a partir da branch 'main'"
    echo "📍 Branch atual: $current_branch"
    exit 1
fi

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    echo "❌ Erro: Há mudanças não commitadas"
    echo "💡 Faça commit das mudanças antes de criar uma release"
    exit 1
fi

# Tipo de versão (patch por padrão)
VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "❌ Erro: Tipo de versão inválido: $VERSION_TYPE"
    echo "💡 Use: patch, minor ou major"
    exit 1
fi

# Obter versão atual do package.json
current_version=$(node -p "require('./package.json').version")
echo "📦 Versão atual: v$current_version"

# Calcular nova versão
case $VERSION_TYPE in
    "patch")
        new_version=$(echo $current_version | awk -F. '{print $1"."$2"."($3+1)}')
        ;;
    "minor")
        new_version=$(echo $current_version | awk -F. '{print $1"."($2+1)".0"}')
        ;;
    "major")
        new_version=$(echo $current_version | awk -F. '{print ($1+1)".0.0"}')
        ;;
esac

echo "🚀 Nova versão: v$new_version"

# Confirmar
echo -n "❓ Continuar com a release? (y/N): "
read -r confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "❌ Release cancelada"
    exit 0
fi

# Atualizar package.json
echo "📝 Atualizando package.json..."
npm version $new_version --no-git-tag-version

# Commit e tag
echo "📊 Criando commit e tag..."
git add package.json
git commit -m "chore: bump version to v$new_version"
git tag -a "v$new_version" -m "Release v$new_version"

# Push
echo "⬆️ Fazendo push..."
git push origin main
git push origin "v$new_version"

echo ""
echo "✅ Release v$new_version criada com sucesso!"
echo "🔗 Acompanhe o build em: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
echo "🐳 A imagem Docker será publicada automaticamente"

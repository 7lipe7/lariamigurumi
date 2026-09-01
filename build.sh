#!/bin/sh
# Gera js/config.js a partir das variáveis de ambiente do ambiente de build
# (configure SUPABASE_URL e SUPABASE_ANON_KEY no dashboard da Vercel).
#
# Sem as variáveis (ex.: build local), mantém o js/config.js já existente,
# permitindo desenvolvimento local sem sobrescrever nada.

# Remove aspas/espacos das pontas dos valores (protecao contra valores
# colados com "..." ou '...' no dashboard da Vercel).
limpar() {
    _v="$1"
    _v=$(echo "$_v" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')
    case "$_v" in
        \"*\") _v="${_v#\"}"; _v="${_v%\"}" ;;
        \'*\') _v="${_v#\'}"; _v="${_v%\'}" ;;
    esac
    echo "$_v"
}

SUPA_URL_LIMPA=$(limpar "$SUPABASE_URL")
SUPA_KEY_LIMPA=$(limpar "$SUPABASE_ANON_KEY")

if [ -n "$SUPA_URL_LIMPA" ] && [ -n "$SUPA_KEY_LIMPA" ]; then
    mkdir -p js
    printf 'window.ENV = {\n  SUPABASE_URL: "%s",\n  SUPABASE_ANON_KEY: "%s",\n};\n' \
        "$SUPA_URL_LIMPA" "$SUPA_KEY_LIMPA" > js/config.js
    echo "js/config.js gerado a partir das variáveis de ambiente."
else
    echo "AVISO: SUPABASE_URL/SUPABASE_ANON_KEY nao definidas — mantendo js/config.js existente (local)."
fi

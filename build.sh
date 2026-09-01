#!/bin/sh
# Gera js/config.js a partir das variáveis de ambiente do ambiente de build
# (configure SUPABASE_URL e SUPABASE_ANON_KEY no dashboard da Vercel).
#
# Sem as variáveis (ex.: build local), mantém o js/config.js já existente,
# permitindo desenvolvimento local sem sobrescrever nada.

if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
    mkdir -p js
    printf 'window.ENV = {\n  SUPABASE_URL: "%s",\n  SUPABASE_ANON_KEY: "%s",\n};\n' \
        "$SUPABASE_URL" "$SUPABASE_ANON_KEY" > js/config.js
    echo "js/config.js gerado a partir das variáveis de ambiente."
else
    echo "AVISO: SUPABASE_URL/SUPABASE_ANON_KEY nao definidas — mantendo js/config.js existente (local)."
fi

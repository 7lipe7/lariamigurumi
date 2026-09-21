
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
    echo " js/config.js existente (local)."
fi

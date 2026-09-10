# Lari Amigurumi — Landpage

Site estático (HTML/CSS/JS puro) publicado na Vercel, integrado ao painel administrativo (`Adm-lariAmigurumi`) através do Supabase.

## Como funciona

- **`index.html`** — seção "Produtos em destaque" busca na tabela `produtos` (Supabase) os itens marcados com `destaque = true`
- **`catalago.html`** — catálogo completo (todos os produtos não-esgotados, inclusive os destaques) com busca por nome, filtros por categoria (sidebar) e filtro "⭐ Destaques"
- Imagens do Supabase Storage são carregadas otimizadas (WebP via transformação do Storage, com fallback para a original)
- Encomendas pelo WhatsApp

## Configuração

Este site **não usa arquivos de ambiente (`.env`)**. A configuração é feita assim:

- **Produção (Vercel):** a cada build, o `build.sh` gera o `js/config.js`
  (`window.ENV`) a partir das variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY`
  configuradas no dashboard da Vercel (Settings → Environment Variables).
- **Desenvolvimento local:** copie `js/config.example.js` para `js/config.js`
  e preencha com os valores reais (`js/config.js` está no `.gitignore` e
  nunca é commitado).

Obs.: a chave "anon" do Supabase é pública por design — a proteção real dos
dados é feita pelas policies de RLS no banco.

## Estrutura JS

- `js/comum.js` — utilidades compartilhadas (ENV, escape, preço, WhatsApp, lazy load, ano do rodapé)
- `js/destaques.js` — destaques do index
- `js/catalagoDinamico.js` — cards do catálogo
- `js/catalago.js` — sidebar, filtros e busca


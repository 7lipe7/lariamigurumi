# Lari Amigurumi — Landpage

Site estático (HTML/CSS/JS puro) publicado na Vercel, integrado ao painel administrativo (`Adm-lariAmigurumi`) através do Supabase.

## Como funciona

- **`index.html`** — seção "Produtos em destaque" busca na tabela `produtos` (Supabase) os itens marcados com `destaque = true`
- **`catalago.html`** — catálogo completo (`destaque = false`) com busca por nome e filtros por categoria (sidebar)
- Encomendas pelo WhatsApp

## Variáveis de ambiente

Site estático não tem `.env` em runtime: o `build.sh` gera o `js/config.js`
(`window.ENV`) a partir das variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY`
configuradas no dashboard da Vercel, a cada build.

Para desenvolvimento local, copie `js/config.example.js` para `js/config.js` e preencha
(`js/config.js` está no `.gitignore` e nunca é commitado).

## Estrutura JS

- `js/comum.js` — utilidades compartilhadas (ENV, escape, preço, WhatsApp, lazy load, ano do rodapé)
- `js/destaques.js` — destaques do index
- `js/catalagoDinamico.js` — cards do catálogo
- `js/catalago.js` — sidebar, filtros e busca


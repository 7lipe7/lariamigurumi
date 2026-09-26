# Lari Amigurumi — Landpage

Site estático (HTML/CSS/JS puro) publicado na Vercel, integrado ao painel administrativo (`Adm-lariAmigurumi`) através do Supabase.

## Como funciona

- **`index.html`** — seção "Produtos em destaque" busca na tabela `produtos` (Supabase) os itens marcados com `destaque = true`
- **`catalago.html`** — catálogo completo (todos os produtos não-esgotados, inclusive os destaques) com busca por nome, filtros por categoria (sidebar) e filtro "Destaques"
- Imagens do Supabase Storage são carregadas na URL original (lazy load com fallback); a conversão WebP automática foi desativada — envie as fotos já comprimidas pelo painel adm
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

## Segurança

- **RLS no Supabase:** a tabela `produtos` é pública só para `SELECT`; escrita
  (insert/update/delete), a tabela `encomendas` (PII) e o upload no Storage são
  bloqueados para o papel `anon`. A chave anon é pública por design — quem
  protege os dados são as policies.
- **CSP com nonce (`vercel.json`):** o nonce `9ec928a622fad4653d777d562103854f`
  é aplicado em **todas** as tags `<script>` de `index.html` e `catalago.html`,
  com `'strict-dynamic'`. Em navegadores modernos (CSP3) o `'unsafe-inline'` é
  ignorado, então um `<script>` injetado não executa.
  - ⚠️ **Ao adicionar, remover ou alterar qualquer tag `<script>`**, inclua
    `nonce="9ec928a622fad4653d777d562103854f"` — sem isso o script é bloqueado
    pelo CSP. O mesmo valor está em `script-src` no `vercel.json`; se trocar o
    nonce, troque nos dois lugares.
  - Limitação conhecida: por ser um site estático, o nonce não é gerado por
    requisição. Ele é melhor que `'unsafe-inline'` puro, mas não é tão forte
    quanto um nonce dinâmico (que exigiria SSR/Edge Middleware).
- **XSS:** todo dado vindo do Supabase passa por `escapar()` antes de ir para o
  HTML, e `urlImagemOtimizada()` só aceita `https://` do host do próprio
  Supabase Storage (qualquer outro esquema/host vira o placeholder).
- Ao mudar `js/*.js`, bumps o `?v=` correspondente nas tags `<script>` para
  invalidar cache.

## Estrutura JS

- `js/comum.js` — utilidades compartilhadas (ENV, escape, preço, WhatsApp, lazy load, ano do rodapé)
- `js/destaques.js` — destaques do index
- `js/catalagoDinamico.js` — cards do catálogo
- `js/catalago.js` — sidebar, filtros e busca
- `js/lightbox.js` — visualização das fotos em tela cheia (swipe, setas e teclado)


// ===== Utilidades compartilhadas (carregado em todas as páginas) =====

// Ano automático no rodapé
const elementoAno = document.getElementById("ano");
if (elementoAno) elementoAno.textContent = new Date().getFullYear();

// Configuração (js/config.js — variáveis de ambiente; NÃO versionado)
const ENV = window.ENV || {};
const SUPABASE_URL = ENV.SUPABASE_URL;
const SUPABASE_ANON_KEY = ENV.SUPABASE_ANON_KEY;
const CONFIG_OK = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
if (!CONFIG_OK) {
    console.warn("Supabase não configurado: copie js/config.example.js para js/config.js e preencha.");
}

const WHATSAPP_NUMERO = "5519998223884";
const IMAGEM_PLACEHOLDER = "img/icon/capivara.png";

function escapar(texto) {
    return String(texto ?? "")
        .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function formatarPreco(preco) {
    const numero = Number(preco);
    return Number.isFinite(numero) ? "R$ " + numero.toFixed(2).replace(".", ",") : "";
}

function linkWhatsapp(nome) {
    const texto = encodeURIComponent("Olá, gostaria de saber mais sobre o " + String(nome || "").toLowerCase());
    return "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + texto;
}

// ===== Imagens do catálogo =====
// A conversão automática para WebP (endpoint de transformação do Supabase
// Storage, /storage/v1/render/...) foi DESATIVADA: o recurso só existe nos
// planos pagos do Supabase e quando indisponível deixava as fotos lentas
// (pedido falho + fallback) ou quebradas.
// Agora as fotos são carregadas na URL original, direto do Storage.
// Dica: envie as fotos já redimensionadas (~100–200 KB) no painel adm para
// o site continuar leve.
function urlImagemOtimizada(url) {
    return String(url || "");
}

// ===== Lazy loading compartilhado =====
let lazyObserver = null;
if ("IntersectionObserver" in window) {
    // rootMargin: começa a carregar um pouco antes da imagem entrar na tela
    lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                carregarImagemLazy(entry.target);
                lazyObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: "200px 0px" });
}

// Define o src e só revela a imagem (classe .loaded) QUANDO ELA TERMINAR
// de carregar — evita o "flash" de card branco entre o skeleton e a foto.
// Se o src falhar, tenta a URL original (data-original) antes de desistir.
function carregarImagemLazy(img) {
    if (!img.dataset.src) return;
    img.src = img.dataset.src;

    const revelar = () => img.classList.add("loaded");

    const aoFalhar = () => {
        img.removeEventListener("load", revelar);
        if (img.dataset.original && img.src !== img.dataset.original) {
            img.src = img.dataset.original;
            img.addEventListener("load", revelar, { once: true });
            img.addEventListener("error", revelar, { once: true });
        } else {
            revelar();
        }
    };

    if (img.complete) {
        img.naturalWidth > 0 ? revelar() : aoFalhar();
        return;
    }
    img.addEventListener("load", revelar, { once: true });
    img.addEventListener("error", aoFalhar, { once: true });
}

// Observa imagens com data-src ainda sem src. Pode ser chamado novamente
// depois de injetar cards dinâmicos no HTML.
function observarLazyImagens() {
    const imagens = document.querySelectorAll("img.lazy:not([src])");
    if (lazyObserver) {
        imagens.forEach((img) => lazyObserver.observe(img));
    } else {
        // Fallback: navegador sem IntersectionObserver carrega tudo direto
        imagens.forEach((img) => carregarImagemLazy(img));
    }
}

document.addEventListener("DOMContentLoaded", () => observarLazyImagens());
window.observarLazyImagens = observarLazyImagens;

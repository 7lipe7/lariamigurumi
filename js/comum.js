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

// ===== Lazy loading compartilhado =====
let lazyObserver = null;
if ("IntersectionObserver" in window) {
    lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add("loaded");
                lazyObserver.unobserve(img);
            }
        });
    });
}

// Observa imagens com data-src ainda sem src. Pode ser chamado novamente
// depois de injetar cards dinâmicos no HTML.
function observarLazyImagens() {
    const imagens = document.querySelectorAll("img.lazy:not([src])");
    if (lazyObserver) {
        imagens.forEach((img) => lazyObserver.observe(img));
    } else {
        // Fallback: navegador sem IntersectionObserver carrega tudo direto
        imagens.forEach((img) => {
            img.src = img.dataset.src;
            img.classList.add("loaded");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => observarLazyImagens());
window.observarLazyImagens = observarLazyImagens;


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

function criarCardDestaque(p) {
    const imagem = p.imagem_url || IMAGEM_PLACEHOLDER;
    return `
        <div class="produto">
            <img data-src="${escapar(imagem)}" alt="${escapar(p.nome)} amigurumi de crochê" class="lazy" loading="lazy">
            <h3>${escapar(p.nome)}</h3>
            <p>${escapar(p.descricao)}</p>
            <div class="price">
                <p>${formatarPreco(p.preco)}</p>
                <a href="${linkWhatsapp(p.nome)}" target="_blank" rel="noopener noreferrer" class="btn">saber mais</a>
            </div>
        </div>`;
}

function observarNovasImagens() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add("loaded");
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll(".produtos_container img.lazy:not([src])").forEach((img) => observer.observe(img));
}

async function carregarDestaques() {
    if (!CONFIG_OK) return; 
    try {
        const url = SUPABASE_URL +
            "/rest/v1/produtos?select=id,nome,descricao,preco,status,imagem_url" +
            "&destaque=eq.true&status=neq.Esgotado&order=id.desc";

        const resposta = await fetch(url, {
            headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY },
        });
        if (!resposta.ok) throw new Error("HTTP " + resposta.status);

        const produtos = await resposta.json();
        if (!Array.isArray(produtos) || produtos.length === 0) return; // mantém os estáticos

        const container = document.querySelector(".produtos_container");
        if (!container) return;
        container.innerHTML = produtos.map(criarCardDestaque).join("");
        observarNovasImagens();
    } catch (erro) {
        console.warn("Destaques dinâmicos indisponíveis, mantendo destaques estáticos.", erro);
    }
}

document.addEventListener("DOMContentLoaded", carregarDestaques);

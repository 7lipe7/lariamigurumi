// Configuração vem de js/config.js (variáveis de ambiente do site estático).
// js/config.js NÃO é versionado — copie js/config.example.js para criar o seu.
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

// Mapeia as categorias do adm para os filtros da sidebar (data-filtro)
function classeCategoria(categoria) {
    const c = String(categoria || "").toLowerCase();
    if (c.startsWith("ursinho")) return "ursinhos";
    if (c.startsWith("coelho")) return "coelhos";
    if (c.startsWith("personagem")) return "personagens";
    if (c.startsWith("peixe")) return "peixes";
    if (c.startsWith("cacto")) return "cactos";
    // personalisado, chaveiros e demais ficam em "especial"
    return "especial";
}

function formatarPreco(preco) {
    const numero = Number(preco);
    return Number.isFinite(numero) ? "R$ " + numero.toFixed(2).replace(".", ",") : "";
}

function linkWhatsapp(nome) {
    const texto = encodeURIComponent("ola gostaria de saber mais sobre o amigurumi de " + String(nome || "").toLowerCase());
    return "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + texto;
}

function criarCard(p) {
    const imagem = p.imagem_url || IMAGEM_PLACEHOLDER;
    const categoria = classeCategoria(p.categoria);
    const badge = p.status === "Sob encomenda" ? '<span class="badge-encomenda">sob encomenda</span>' : "";
    return `
        <div class="card ${categoria}" data-categoria="${categoria}">
            <img data-src="${escapar(imagem)}" alt="${escapar(p.nome)} amigurumi" class="lazy" loading="lazy">
            <div class="desc">
                <h3>${escapar(p.nome)}</h3> <span class="price">${formatarPreco(p.preco)}</span>
            </div>
            <p>${escapar(p.descricao)}</p>
            ${badge}
            <a href="${linkWhatsapp(p.nome)}" target="_blank" rel="noopener noreferrer" class="btn">Encomendar</a>
        </div>`;
}

async function carregarProdutos() {
    if (!CONFIG_OK) return; // mantém o catálogo estático sem config
    try {
        const url = SUPABASE_URL +
            "/rest/v1/produtos?select=id,nome,descricao,preco,categoria,status,destaque,imagem_url" +
            "&destaque=eq.false&status=neq.Esgotado&order=id.desc";

        const resposta = await fetch(url, {
            headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY },
        });
        if (!resposta.ok) throw new Error("HTTP " + resposta.status);

        const produtos = await resposta.json();
        if (!Array.isArray(produtos) || produtos.length === 0) return; 

        const main = document.querySelector(".main");
        if (!main) return;

        // remove apenas os cards estáticos, preservando o aviso "sem-resultados"
        main.querySelectorAll(".card").forEach((card) => card.remove());
        main.insertAdjacentHTML("afterbegin", produtos.map(criarCard).join(""));


        if (typeof window.observarImagens === "function") window.observarImagens();
    } catch (erro) {
        console.warn("Catálogo dinâmico indisponível, mantendo catálogo estático.", erro);
    }
}

document.addEventListener("DOMContentLoaded", carregarProdutos);
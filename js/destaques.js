// Destaques do index: produtos marcados como destaque no painel adm (Supabase).
// Depende de js/comum.js (ENV, escapar, formatarPreco, linkWhatsapp, lazy load).

function criarCardDestaque(p) {
    const imagem = p.imagem_url || IMAGEM_PLACEHOLDER;
    return `
        <div class="produto">
            <img data-src="${escapar(urlImagemOtimizada(imagem))}" data-original="${escapar(imagem)}" alt="${escapar(p.nome)} amigurumi de crochê" class="lazy" loading="lazy" decoding="async">
            <h3>${escapar(p.nome)}</h3>
            <p>${escapar(p.descricao)}</p>
            <div class="price">
                <p>${formatarPreco(p.preco)}</p>
                <a href="${linkWhatsapp(p.nome)}" target="_blank" rel="noopener noreferrer" class="btn">saber mais</a>
            </div>
        </div>`;
}

async function carregarDestaques() {
    if (!CONFIG_OK) return;

    const container = document.querySelector(".produtos_container");
    if (!container) return;

    // Skeletons depois do card estático, reservando espaço durante o fetch
    container.insertAdjacentHTML(
        "beforeend",
        Array.from({ length: 3 }, criarSkeletonCard).join("")
    );

    try {
        const url = SUPABASE_URL +
            "/rest/v1/produtos?select=id,nome,descricao,preco,status,imagem_url" +
            "&destaque=eq.true&status=neq.Esgotado&order=id.desc";

        const resposta = await fetch(url, {
            headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY },
        });
        if (!resposta.ok) throw new Error("HTTP " + resposta.status);

        const produtos = await resposta.json();

        // remove os skeletons em qualquer caminho (sucesso, vazio ou erro)
        container.querySelectorAll(".skeleton-card").forEach((s) => s.remove());

        if (!Array.isArray(produtos) || produtos.length === 0) return; // mantém os estáticos

        container.innerHTML = produtos.map(criarCardDestaque).join("");
        window.observarLazyImagens();
    } catch (erro) {
        container.querySelectorAll(".skeleton-card").forEach((s) => s.remove());
        console.warn("Destaques dinâmicos indisponíveis, mantendo destaques estáticos.", erro);
    }
}

// Card placeholder com o mesmo formato/medidas dos cards de destaque
function criarSkeletonCard() {
    return `
        <div class="skeleton-card" aria-hidden="true">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-line titulo"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-btn"></div>
        </div>`;
}

document.addEventListener("DOMContentLoaded", carregarDestaques);

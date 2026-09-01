// Destaques do index: produtos marcados como destaque no painel adm (Supabase).
// Depende de js/comum.js (ENV, escapar, formatarPreco, linkWhatsapp, lazy load).

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
        window.observarLazyImagens();
    } catch (erro) {
        console.warn("Destaques dinâmicos indisponíveis, mantendo destaques estáticos.", erro);
    }
}

document.addEventListener("DOMContentLoaded", carregarDestaques);

// Catálogo dinâmico: produtos cadastrados no painel adm (Supabase).
// Inclui os produtos em destaque — eles ganham um badge e o filtro
// "Destaques" da sidebar mostra só eles.
// Depende de js/comum.js (ENV, escapar, formatarPreco, linkWhatsapp, lazy load,
// urlImagemOtimizada).

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

function criarCard(p) {
    const imagem = p.imagem_url || IMAGEM_PLACEHOLDER;
    const categoria = classeCategoria(p.categoria);
    const badge = p.status === "Sob encomenda" ? '<span class="badge-encomenda">sob encomenda</span>' : "";
    const badgeDestaque = p.destaque === true ? '<span class="badge-destaque">⭐ destaque</span>' : "";
    return `
        <div class="card ${categoria}" data-categoria="${categoria}" data-destaque="${p.destaque === true}">
            <img data-src="${escapar(urlImagemOtimizada(imagem))}" data-original="${escapar(imagem)}" alt="${escapar(p.nome)} amigurumi" class="lazy" loading="lazy" decoding="async">
            <div class="desc">
                <h3>${escapar(p.nome)}</h3> <span class="price">${formatarPreco(p.preco)}</span>
            </div>
            <p>${escapar(p.descricao)}</p>
            ${badgeDestaque}
            ${badge}
            <a href="${linkWhatsapp(p.nome)}" target="_blank" rel="noopener noreferrer" class="btn">Encomendar</a>
        </div>`;
}

async function carregarProdutos() {
    if (!CONFIG_OK) return; // sem config: sem catálogo dinâmico

    const main = document.querySelector(".main");
    if (!main) return;

    // Skeletons: reservam o espaço dos cards enquanto o fetch roda,
    // evitando página vazia e pulo de layout (CLS)
    main.insertAdjacentHTML(
        "afterbegin",
        Array.from({ length: 6 }, criarSkeletonCard).join("")
    );

    try {
        const url = SUPABASE_URL +
            "/rest/v1/produtos?select=id,nome,descricao,preco,categoria,status,imagem_url,destaque" +
            "&status=neq.Esgotado&order=id.desc";

        const resposta = await fetch(url, {
            headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY },
        });
        if (!resposta.ok) throw new Error("HTTP " + resposta.status);

        const produtos = await resposta.json();

        // remove os skeletons
        main.querySelectorAll(".skeleton-card").forEach((s) => s.remove());

        // remove eventuais cards estáticos antigos, preservando o aviso
        main.querySelectorAll(".card").forEach((card) => card.remove());

        if (Array.isArray(produtos) && produtos.length > 0) {
            main.insertAdjacentHTML("afterbegin", produtos.map(criarCard).join(""));
            window.observarLazyImagens();
        } else {
            // nenhum produto disponível: mostra o aviso
            const aviso = document.getElementById("sem-resultados");
            if (aviso) aviso.style.display = "block";
        }
    } catch (erro) {
        // remove os skeletons também em caso de erro
        main.querySelectorAll(".skeleton-card").forEach((s) => s.remove());
        console.warn("Catálogo dinâmico indisponível.", erro);
    }
}

// Card placeholder com o mesmo formato/medidas dos cards reais
function criarSkeletonCard() {
    return `
        <div class="skeleton-card" aria-hidden="true">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-line titulo"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-btn"></div>
        </div>`;
}

document.addEventListener("DOMContentLoaded", carregarProdutos);
// ===== Sidebar (menu de categorias) =====
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const btnFechar = document.getElementById("btn-fechar");
const busca = document.getElementById("busca");
const avisoSemResultados = document.getElementById("sem-resultados");

function alternarSidebar(abrir) {
    const aberto = abrir ?? !sidebar.classList.contains("aberto");
    sidebar.classList.toggle("aberto", aberto);
    overlay.classList.toggle("aberto", aberto);
    hamburger.classList.toggle("ativo", aberto);
    sidebar.setAttribute("aria-hidden", String(!aberto));
    hamburger.setAttribute("aria-expanded", String(aberto));
}

hamburger.addEventListener("click", () => alternarSidebar());
btnFechar.addEventListener("click", () => alternarSidebar(false));
overlay.addEventListener("click", () => alternarSidebar(false));
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") alternarSidebar(false);
});

// ===== Busca e filtros por categoria =====
let filtroAtual = "todos";

// remove acentos e deixa minúsculo para a busca ignorar diferenças
const normalizar = (texto) =>
    String(texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function produtoVisivel(card) {
    const termo = normalizar(busca.value.trim());
    const nome = normalizar(card.querySelector("h3")?.textContent);
    const categoria = card.dataset.categoria || "";

    const casaCategoria = filtroAtual === "todos" || categoria === filtroAtual;
    const casaBusca = !termo || nome.includes(termo);
    return casaCategoria && casaBusca;
}

function aplicarFiltros() {
    let visiveis = 0;

    document.querySelectorAll(".main .card").forEach((card) => {
        const mostrar = produtoVisivel(card);
        card.style.display = mostrar ? "block" : "none";
        if (mostrar) visiveis++;
    });

    if (avisoSemResultados) {
        avisoSemResultados.style.display = visiveis === 0 ? "block" : "none";
    }
}

document.querySelectorAll("#botoes .botao").forEach((botao) => {
    botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro || "todos";

        document.querySelectorAll("#botoes .botao").forEach((b) => b.classList.remove("selecionado"));
        botao.classList.add("selecionado");

        aplicarFiltros();
        alternarSidebar(false); // fecha a sidebar ao escolher
    });
});

if (busca) {
    busca.addEventListener("input", aplicarFiltros);
}


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

function observarImagens() {
    document.querySelectorAll("img.lazy:not([src])").forEach((img) => observer.observe(img));
}
observarImagens();
window.observarImagens = observarImagens; // usado pelo catálogo dinâmico

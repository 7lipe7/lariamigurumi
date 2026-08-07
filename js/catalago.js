// ================== FILTRO DE CATEGORIAS ==================

// Seleciona todos os botões de filtro e todos os cards de produtos
const botoesFiltro = document.querySelectorAll(".botoes .botao");
const cards = document.querySelectorAll(".card[data-categoria]");

// Campo de busca e mensagem de "sem resultados"
const buscaInput = document.getElementById("busca");
const semResultados = document.getElementById("sem-resultados");

// Remove o botão "Todos" para retornar ao estado inicial da página
const botaoTodos = document.querySelector('[data-filtro="todos"]');
if (botaoTodos) {
    botaoTodos.style.display = "none";
}

// Categoria ativa atual (começa como "todos")
let categoriaAtiva = "todos";

function filtrar(categoria) {
    let algumVisivel = false;
    const termo = (buscaInput ? buscaInput.value : "").trim().toLowerCase();

    cards.forEach((card) => {
        const categoriasCard = (card.dataset.categoria || "").split(" ");
        const nome = (card.querySelector("h3")?.textContent || "").toLowerCase();

        // Mostra o card se for "todos" ou se a categoria estiver presente
        const pertence = categoria === "todos" || categoriasCard.includes(categoria);
        // Verifica se o nome do produto contém o termo buscado
        const correspondeBusca = termo === "" || nome.includes(termo);

        if (pertence && correspondeBusca) {
            card.style.display = "block";
            algumVisivel = true;
        } else {
            card.style.display = "none";
        }
    });

    // Mostra mensagem de "sem resultados" quando nada é encontrado
    if (semResultados) {
        semResultados.classList.toggle("visivel", !algumVisivel);
    }

    // Mostra o botão "Todos" somente quando um filtro está ativo
    if (botaoTodos) {
        botaoTodos.style.display = categoria === "todos" ? "none" : "flex";
    }
}

botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
        const categoria = botao.dataset.filtro;
        if (!categoria) return; // ignora botões sem filtro (ex: "Voltar")

        categoriaAtiva = categoria;
        filtrar(categoria);

        // Fecha a sidebar após escolher uma categoria
        fecharSidebar();
    });
});

// ================== BUSCA POR NOME ==================

if (buscaInput) {
    buscaInput.addEventListener("input", () => {
        filtrar(categoriaAtiva);
    });
}

// ================== BOTÃO HAMBÚRGUER / SIDEBAR ==================

const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const btnFechar = document.getElementById("btn-fechar");

function abrirSidebar() {
    if (!sidebar || !overlay || !hamburger) return;
    sidebar.classList.add("aberto");
    sidebar.setAttribute("aria-hidden", "false");
    overlay.classList.add("aberto");
    hamburger.classList.add("ativo");
    hamburger.setAttribute("aria-expanded", "true");
}

function fecharSidebar() {
    if (!sidebar || !overlay || !hamburger) return;
    sidebar.classList.remove("aberto");
    sidebar.setAttribute("aria-hidden", "true");
    overlay.classList.remove("aberto");
    hamburger.classList.remove("ativo");
    hamburger.setAttribute("aria-expanded", "false");
}

if (hamburger) {
    hamburger.addEventListener("click", () => {
        if (sidebar.classList.contains("aberto")) {
            fecharSidebar();
        } else {
            abrirSidebar();
        }
    });
}

if (overlay) {
    overlay.addEventListener("click", fecharSidebar);
}

if (btnFechar) {
    btnFechar.addEventListener("click", fecharSidebar);
}

// ================== LAZY LOADING DAS IMAGENS ==================

const imagens = document.querySelectorAll(".lazy");

if ("IntersectionObserver" in window) {
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

    imagens.forEach((img) => observer.observe(img));
} else {
    // Fallback: carrega todas as imagens direto se o navegador não suportar
    imagens.forEach((img) => {
        img.src = img.dataset.src;
        img.classList.add("loaded");
    });
}

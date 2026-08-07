// ================== FILTRO DE CATEGORIAS ==================

// Seleciona todos os botões de filtro e todos os cards de produtos
const botoesFiltro = document.querySelectorAll(".botoes .botao");
const cards = document.querySelectorAll(".card[data-categoria]");

// Remove o botão "Todos" para retornar ao estado inicial da página
const botaoTodos = document.querySelector('[data-filtro="todos"]');
if (botaoTodos) {
    botaoTodos.style.display = "none";
}

function filtrar(categoria) {
    let algumVisivel = false;

    cards.forEach((card) => {
        const categoriasCard = (card.dataset.categoria || "").split(" ");

        // Mostra o card se for "todos" ou se a categoria estiver presente
        const pertence = categoria === "todos" || categoriasCard.includes(categoria);

        if (pertence) {
            card.style.display = "block";
            algumVisivel = true;
        } else {
            card.style.display = "none";
        }
    });

    // Mostra o botão "Todos" somente quando um filtro está ativo
    if (botaoTodos) {
        botaoTodos.style.display = categoria === "todos" ? "none" : "flex";
    }
}

botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
        const categoria = botao.dataset.filtro;
        if (!categoria) return; // ignora botões sem filtro (ex: "Voltar")

        filtrar(categoria);

        // Fecha a sidebar após escolher uma categoria
        fecharSidebar();
    });
});

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

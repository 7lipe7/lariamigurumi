// ===== Lightbox em tela cheia para as imagens dos produtos =====
// Depende de js/comum.js. Ao clicar numa foto de produto, abre em tela cheia
// com navegação: arrastar (swipe) para os lados, setas e teclado (← → Esc).

(function () {
    let lightbox = null;   // overlay criado sob demanda
    let imgEl = null;      // <img> do lightbox
    let stageEl = null;    // área arrastável em volta da imagem
    let legendaEl = null;
    let contadorEl = null;
    let imagens = [];      // URLs navegáveis (só as visíveis na página)
    let indice = 0;
    let aberto = false;

    // Só fotos de produto abrem o lightbox — ícones e logos ficam de fora
    function ehImagemDeProduto(img) {
        if (!img || img.tagName !== "IMG") return false;
        const url = img.dataset.original || img.dataset.src || img.src || "";
        return url !== "" && !url.includes("img/icon/");
    }

    // Apenas imagens atualmente visíveis (respeita os filtros do catálogo)
    function imagensVisiveis() {
        return Array.from(document.querySelectorAll("img")).filter(
            (img) => ehImagemDeProduto(img) && img.offsetParent !== null
        );
    }

    // Usa a imagem original (sem a versão otimizada do lazy load)
    function urlGrande(img) {
        return img.dataset.original || img.dataset.src || img.src;
    }

    function criar() {
        lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.innerHTML = `
            <button type="button" class="lightbox-fechar" aria-label="Fechar">&times;</button>
            <button type="button" class="lightbox-seta lightbox-anterior" aria-label="Imagem anterior">&#10094;</button>
            <div class="lightbox-stage">
                <img class="lightbox-img" alt="">
                <p class="lightbox-legenda"></p>
            </div>
            <button type="button" class="lightbox-seta lightbox-proxima" aria-label="Próxima imagem">&#10095;</button>
            <span class="lightbox-contador"></span>`;
        document.body.appendChild(lightbox);

        imgEl = lightbox.querySelector(".lightbox-img");
        stageEl = lightbox.querySelector(".lightbox-stage");
        legendaEl = lightbox.querySelector(".lightbox-legenda");
        contadorEl = lightbox.querySelector(".lightbox-contador");

        // fechar: botão X ou clique fora da imagem
        lightbox.querySelector(".lightbox-fechar").addEventListener("click", fechar);
        stageEl.addEventListener("click", (e) => {
            if (e.target === stageEl) fechar();
        });
        lightbox.querySelector(".lightbox-anterior").addEventListener("click", () => mostrar(indice - 1, -1));
        lightbox.querySelector(".lightbox-proxima").addEventListener("click", () => mostrar(indice + 1, 1));


        // ===== Arrastar para os lados (mouse e toque, via Pointer Events) =====
        let arrastando = false;
        let startX = 0;
        let dx = 0;

        stageEl.addEventListener("pointerdown", (e) => {
            if (!aberto) return;
            arrastando = true;
            startX = e.clientX;
            dx = 0;
            imgEl.classList.add("arrastando");
            stageEl.setPointerCapture(e.pointerId);
        });

        stageEl.addEventListener("pointermove", (e) => {
            if (!arrastando) return;
            dx = e.clientX - startX;
            imgEl.style.transform = "translateX(" + dx + "px)";
        });

        function soltar() {
            if (!arrastando) return;
            arrastando = false;
            imgEl.classList.remove("arrastando");
            imgEl.style.transform = "";
            const LIMIAR = 60; // px arrastados para trocar de imagem
            if (dx <= -LIMIAR && indice < imagens.length - 1) mostrar(indice + 1, 1);
            else if (dx >= LIMIAR && indice > 0) mostrar(indice - 1, -1);
        }

        stageEl.addEventListener("pointerup", soltar);
        stageEl.addEventListener("pointercancel", soltar);
    }

    function mostrar(i, direcao) {
        if (i < 0 || i >= imagens.length || imagens.length === 0) return;
        indice = i;

        // pequena animação de slide na direção arrastada/clicada
        if (direcao !== 0) {
            imgEl.classList.remove("slide-esq", "slide-dir");
            void imgEl.offsetWidth; // força reflow para reiniciar a animação
            imgEl.classList.add(direcao > 0 ? "slide-esq" : "slide-dir");
        }

        imgEl.src = imagens[indice].src;
        legendaEl.textContent = imagens[indice].alt;
        contadorEl.textContent = imagens.length > 1 ? (indice + 1) + " / " + imagens.length : "";

        // setas ficam escondidas quando não há para onde ir
        lightbox.querySelector(".lightbox-anterior").classList.toggle("oculta", indice === 0);
        lightbox.querySelector(".lightbox-proxima").classList.toggle("oculta", indice === imagens.length - 1);

        // pré-carrega as vizinhas para o swipe fluir
        [indice - 1, indice + 1].forEach((n) => {
            if (n >= 0 && n < imagens.length) {
                const pre = new Image();
                pre.src = imagens[n].src;
            }
        });
    }

    function abrir(imgClicada) {
        imagens = imagensVisiveis().map((img) => ({
            src: urlGrande(img),
            alt: img.alt || ""
        }));
        if (imagens.length === 0) return;

        const alvo = urlGrande(imgClicada);
        indice = Math.max(0, imagens.findIndex((p) => p.src === alvo));

        if (!lightbox) criar();
        aberto = true;
        lightbox.classList.add("aberto");
        document.body.style.overflow = "hidden"; // trava o scroll de fundo
        mostrar(indice, 0);
    }

    function fechar() {
        if (!lightbox) return;
        aberto = false;
        lightbox.classList.remove("aberto");
        imgEl.removeAttribute("src");
        imgEl.style.transform = "";
        document.body.style.overflow = "";
    }

    // Teclado: Esc fecha, setas navegam
    document.addEventListener("keydown", (e) => {
        if (!aberto) return;
        if (e.key === "Escape") fechar();
        else if (e.key === "ArrowLeft") mostrar(indice - 1, -1);
        else if (e.key === "ArrowRight") mostrar(indice + 1, 1);
    });

    // Delegação de eventos: funciona também para os cards injetados via fetch
    document.addEventListener("click", (e) => {
        const img = e.target.closest("img");
        if (img && ehImagemDeProduto(img)) {
            e.preventDefault();
            abrir(img);
        }
    });
})();

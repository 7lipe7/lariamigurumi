// ================== ANO AUTOMÁTICO NO RODAPÉ ==================

const elementoAno = document.getElementById("ano");
if (elementoAno) {
    elementoAno.textContent = new Date().getFullYear();
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

const boneco = document.querySelectorAll(".boneco");
const chaveiro = document.querySelectorAll(".chaveiro");
const animais = document.querySelectorAll(".animais");
const personalizados = document.querySelectorAll(".personalizados");
const todos = document.querySelectorAll(".botao");

const botaoTodos = document.getElementById("todos");




todos.forEach((botao) => {
    botao.addEventListener("click", () => {
        boneco.forEach((card) => {      
            card.style.display = "block";
        });
        chaveiro.forEach((card) => {      
            card.style.display = "block";
        });  
        animais.forEach((card) => {
            card.style.display = "block";
        }); 
        personalizados.forEach((card) => {
            card.style.display = "block";
        });                                          
        botaoTodos.style.display = "none";
    });
});

const botaoBoneco = document.querySelector(".boneco");
botaoBoneco.addEventListener("click", () => {
    boneco.forEach((card) => {      
        card.style.display = "block";
    });
    chaveiro.forEach((card) => {
        card.style.display = "none";
    });                  
    animais.forEach((card) => {
        card.style.display = "none";
    });
    personalizados.forEach((card) => {
        card.style.display = "none";
    });
    botaoTodos.style.display = "flex";
});

const botaoChaveiro = document.querySelector(".chaveiro");
botaoChaveiro.addEventListener("click", () => {
    boneco.forEach((card) => {
        card.style.display = "none";
    });
    chaveiro.forEach((card) => {
        card.style.display = "block";
    });                  
    animais.forEach((card) => {
        card.style.display = "none";
    });
    personalizados.forEach((card) => {
        card.style.display = "none";
    });
    botaoTodos.style.display = "flex";
});

const botaoAnimais = document.querySelector(".animais");
botaoAnimais.addEventListener("click", () => {
    boneco.forEach((card) => {  
        card.style.display = "none";
    });  
    chaveiro.forEach((card) => {
        card.style.display = "none";
    });
    animais.forEach((card) => {
        card.style.display = "block";
    });
    personalizados.forEach((card) => {
        card.style.display = "none";
    });
    botaoTodos.style.display = "flex";
});

const botaoPersonalisados = document.querySelector(".personalizados");
botaoPersonalisados.addEventListener("click", () => {
    boneco.forEach((card) => {
        card.style.display = "none";
    });
    chaveiro.forEach((card) => {
        card.style.display = "none";
    });
    animais.forEach((card) => {
        card.style.display = "none";
    });
    personalizados.forEach((card) => {
        card.style.display = "block";
    });
    botaoTodos.style.display = "flex";
});



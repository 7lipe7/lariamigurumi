


const imagens = document.querySelectorAll('.lazy');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
     
     setTimeout(() => {
   observer.unobserve(img);
}, 1000);
    }
  });
});

imagens.forEach(img => observer.observe(img));



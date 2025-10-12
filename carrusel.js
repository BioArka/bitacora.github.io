const carrusel = document.querySelector(".cont-cards");
const cards = document.querySelectorAll(".cont-cards .card");
const gap = 20; // espacio entre cards
const cardWidth = cards[0].offsetWidth + gap;

let intervalo = null;
let desplazamiento = 0;

// Clonar cards al final para efecto infinito
cards.forEach(card => {
  const clone = card.cloneNode(true);
  carrusel.appendChild(clone);
});

// Función para avanzar una card
function avanzar() {
  desplazamiento += cardWidth;
  carrusel.scrollTo({
    left: desplazamiento,
    behavior: "smooth"
  });

  // Reinicio suave al llegar al final
  if (desplazamiento >= carrusel.scrollWidth / 2) {
    setTimeout(() => {
      carrusel.scrollLeft = 0;
      desplazamiento = 0;
    }, 300);
  }
}

// Inicia carrusel automático
function iniciarCarrusel() {
  intervalo = setInterval(avanzar, 5000);
}

// Pausar carrusel automático
function pausarCarrusel() {
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }
}

// Scroll manual con mouse o touch
let isDown = false;
let startX;
let scrollLeft;

// --- Eventos para mouse ---
carrusel.addEventListener("mousedown", e => {
  isDown = true;
  startX = e.pageX - carrusel.offsetLeft;
  scrollLeft = carrusel.scrollLeft;
  pausarCarrusel();
});

carrusel.addEventListener("mouseleave", () => isDown && (isDown = false));
carrusel.addEventListener("mouseup", () => isDown && (isDown = false));
carrusel.addEventListener("mousemove", e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carrusel.offsetLeft;
  const walk = (x - startX) * 2;
  carrusel.scrollLeft = scrollLeft - walk;
});

// --- Eventos para touch ---
carrusel.addEventListener("touchstart", e => {
  isDown = true;
  startX = e.touches[0].pageX - carrusel.offsetLeft;
  scrollLeft = carrusel.scrollLeft;
  pausarCarrusel();
});

carrusel.addEventListener("touchend", () => isDown && (isDown = false));
carrusel.addEventListener("touchcancel", () => isDown && (isDown = false));
carrusel.addEventListener("touchmove", e => {
  if (!isDown) return;
  const x = e.touches[0].pageX - carrusel.offsetLeft;
  const walk = (x - startX) * 2;
  carrusel.scrollLeft = scrollLeft - walk;
});

// Scroll manual con rueda
let scrollTimeout;
carrusel.addEventListener("scroll", () => {
  pausarCarrusel();
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    iniciarCarrusel();
  }, 3000);
});

// Inicia al cargar
iniciarCarrusel();

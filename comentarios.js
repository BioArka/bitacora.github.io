// Inicializar Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "bioarka-comentarios.firebaseapp.com",
  projectId: "bioarka-comentarios",
  storageBucket: "bioarka-comentarios.firebasestorage.app",
  messagingSenderId: "1026741057709",
  appId: "1:1026741057709:web:d3ad7deedd9c0399c12e24"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Contenedores
const contTodos = document.getElementById("comentarios-todos");
const contDestacados = document.getElementById("comentarios-destacados");
const tabTodos = document.getElementById("tab-todos");
const tabDestacados = document.getElementById("tab-destacados");
const subtabsContainer = document.getElementById("subtabs-container");

// Pestañas principales
tabTodos.addEventListener("click", () => {
  contTodos.style.display = "block";
  contDestacados.style.display = "none";
  tabTodos.classList.add("active");
  tabDestacados.classList.remove("active");
  subtabsContainer.style.display = "flex"; // mostrar sub-tabs
  mostrarSubTabs();
});

tabDestacados.addEventListener("click", () => {
  contTodos.style.display = "none";
  contDestacados.style.display = "block";
  tabTodos.classList.remove("active");
  tabDestacados.classList.add("active");
  subtabsContainer.style.display = "none"; // ocultar sub-tabs
  mostrarDestacados();
});

// Tiempo relativo
function tiempoRelativo(fecha) {
  if (!fecha) return '';
  const now = new Date();
  const diff = (now - fecha.toDate()) / 1000;
  if (diff < 60) return `Hace ${Math.floor(diff)} segundos`;
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
  if (diff < 2592000) return `Hace ${Math.floor(diff / 86400)} días`;
  if (diff < 31104000) return `Hace ${Math.floor(diff / 2592000)} meses`;
  return `Hace ${Math.floor(diff / 31104000)} años`;
}

// Crear estructura de comentario
function crearComentario(data) {
  const div = document.createElement("div");
  div.classList.add("comentario");
  div.innerHTML = `
    <img src="${data.imagen}" class="img-autor">
    <div class="contenido">
      <div class="header-comentario">
        <h4>${data.autor}</h4>
        <span class="fecha">${tiempoRelativo(data.fecha)}</span>
      </div>
      <p class="texto">${data.contenido}</p>
      <div class="footer-comentario">
        <img src="imagenes/icon-manos.png" alt="Me gusta">
        <span>${data.meGusta || 0}</span>
        ${data.categoria === "destacado"
          ? '<img src="imagenes/icon-pinche.png" alt="Destacado" style="width:20px; vertical-align:middle; margin-left:10px; margin-right:3px;">Fijado'
          : ''}
      </div>
    </div>
  `;
  return div;
}

let comentariosData = [];

// Escucha en tiempo real
db.collection("comentarios").orderBy("fecha", "desc").onSnapshot(snapshot => {
  comentariosData = [];
  snapshot.forEach(doc => comentariosData.push(doc.data()));
  renderComentarios();
});

// Render principal
function renderComentarios() {
  if (tabDestacados.classList.contains("active")) mostrarDestacados();
  else mostrarSubTabs();
}

// Mostrar destacados
function mostrarDestacados() {
  contDestacados.innerHTML = "";
  comentariosData
    .filter(c => c.categoria === "destacado")
    .forEach(c => contDestacados.appendChild(crearComentario(c)));
}

// Mostrar comentarios en sub-tabs
function mostrarSubTabs() {
  contTodos.innerHTML = "";
  subtabsContainer.innerHTML = "";

  if (comentariosData.length === 0) return;

  const grupos = [];
  for (let i = 0; i < comentariosData.length; i += 5) {
    grupos.push(comentariosData.slice(i, i + 5));
  }

  // Crear subtabs
  grupos.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${i + 1}`;
    if (i === 0) btn.classList.add("active");
    btn.addEventListener("click", () => {
      document.querySelectorAll(".subtabs button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      mostrarPagina(i);
    });
    subtabsContainer.appendChild(btn);
  });

  // Mostrar la primera página
  mostrarPagina(0);
}

// Mostrar página seleccionada
function mostrarPagina(index) {
  contTodos.innerHTML = "";
  const grupos = [];
  for (let i = 0; i < comentariosData.length; i += 5) {
    grupos.push(comentariosData.slice(i, i + 5));
  }
  grupos[index].forEach(c => contTodos.appendChild(crearComentario(c)));
}

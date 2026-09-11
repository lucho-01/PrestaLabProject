const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAMb4VygWf3PEw6COt0wJNRNhQokyTSHlQ",
  authDomain: "prestalab-app.firebaseapp.com",
  projectId: "prestalab-app",
  storageBucket: "prestalab-app.firebasestorage.app",
  messagingSenderId: "87481256864",
  appId: "1:87481256864:web:e72942b26171d7e587f2c5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const articles = [
  {
    nombre: 'Cable UTP Cat6 (5m)',
    categoria: 'Cables',
    descripcion: 'Cable de red UTP categoría 6 de 5 metros. Ideal para conexiones de alta velocidad en redes locales.',
    stock: 20,
    estado: 'disponible',
    etiquetado: true,
    imagen: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Router TP-Link Archer C6',
    categoria: 'Redes',
    descripcion: 'Router inalámbrico双频 2.4GHz / 5GHz con 4 puertos LAN. Soporte para hasta 32 dispositivos.',
    stock: 3,
    estado: 'disponible',
    etiquetado: true,
    imagen: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Switch 24 Puertos TP-Link',
    categoria: 'Redes',
    descripcion: 'Switch administrable con 24 puertos Gigabit Ethernet. Ideal para redes de oficina y laboratorio.',
    stock: 5,
    estado: 'disponible',
    etiquetado: true,
    imagen: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Tester de Red Fluke',
    categoria: 'Herramientas',
    descripcion: 'Tester profesional para cables de red y fibra óptica. Incluye adaptador de coaxial.',
    stock: 2,
    estado: 'disponible',
    etiquetado: true,
    imagen: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Crimpadora RJ45',
    categoria: 'Herramientas',
    descripcion: 'Herramienta para crimpar conectores RJ45 en cables de red.',
    stock: 4,
    estado: 'disponible',
    etiquetado: true,
    imagen: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Cable Coaxial (10m)',
    categoria: 'Cables',
    descripcion: 'Cable coaxial de 10 metros para conexiones de video y datos.',
    stock: 8,
    estado: 'disponible',
    etiquetado: true,
    imagen: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Access Point TP-Link',
    categoria: 'Redes',
    descripcion: 'Punto de acceso inalámbrico para extender cobertura de red WiFi.',
    stock: 3,
    estado: 'disponible',
    etiquetado: true,
    imagen: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Cable Patch Cat5e (2m)',
    categoria: 'Cables',
    descripcion: 'Cable de parcheo UTP categoría 5e de 2 metros.',
    stock: 30,
    estado: 'disponible',
    etiquetado: true,
    imagen: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function addArticles() {
  try {
    for (const article of articles) {
      const docRef = await addDoc(collection(db, 'articulos'), article);
      console.log(`Artículo creado: ${article.nombre} - ID: ${docRef.id}`);
    }
    console.log('\n¡Todos los artículos fueron creados exitosamente!');
  } catch (error) {
    console.error('Error al crear artículos:', error);
  }
}

addArticles();

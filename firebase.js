import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

// Configuración de Firebase obtenida de la consola de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAjJQVspw3mwoNPhPH-TE7BrXtaJzy34Og",
    authDomain: "examenreactnative-d402b.firebaseapp.com",
    projectId: "examenreactnative-d402b",
    storageBucket: "examenreactnative-d402b.firebasestorage.app",
    messagingSenderId: "399457507435",
    appId: "1:399457507435:web:804ce7b3a002a2fbe2f92e",
    measurementId: "G-CF0YDXM4W9"
  };
// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la referencia a Firestore
const db = getFirestore(app);

export { db, collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot };

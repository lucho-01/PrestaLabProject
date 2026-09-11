import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/fbConfig";

// Artículos
export const createArticle = async (articleData) => {
  try {
    const docRef = await addDoc(collection(db, "articulos"), {
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...articleData };
  } catch (error) {
    console.error("Error creando el artículo:", error);
    throw error;
  }
};

export const getArticles = async (filters = {}) => {
  try {
    let q = collection(db, "articulos");

    if (filters.category) {
      q = query(q, where("categoria", "==", filters.category));
    }

    if (filters.available) {
      q = query(q, where("stock", ">", 0));
    }

    q = query(q, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener artículos:", error);
    throw error;
  }
};

export const getArticle = async (articleId) => {
  try {
    const docRef = doc(db, "articulos", articleId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error("Artículo no encontrado");
  } catch (error) {
    console.error("Error al obtener artículo:", error);
    throw error;
  }
};

export const updateArticle = async (articleId, updates) => {
  try {
    const docRef = doc(db, "articulos", articleId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error al actualizar artículo:", error);
    throw error;
  }
};

export const deleteArticle = async (articleId) => {
  try {
    await deleteDoc(doc(db, "articulos", articleId));
  } catch (error) {
    console.error("Error al eliminar artículo:", error);
    throw error;
  }
};

// Préstamos
export const createLoan = async (loanData) => {
  try {
    const docRef = await addDoc(collection(db, "prestamos"), {
      ...loanData,
      estado: "activo",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Actualizar stock del artículo
    const articleRef = doc(db, "articulos", loanData.articuloId);
    const articleSnap = await getDoc(articleRef);
    if (articleSnap.exists()) {
      await updateDoc(articleRef, {
        stock: articleSnap.data().stock - loanData.cantidad,
        updatedAt: new Date(),
      });
    }

    return { id: docRef.id, ...loanData };
  } catch (error) {
    console.error("Error al crear préstamo:", error);
    throw error;
  }
};

export const getLoans = async (userId) => {
  try {
    let q = collection(db, "prestamos");

    if (userId) {
      q = query(q, where("userId", "==", userId));
    }

    q = query(q, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener préstamos:", error);
    throw error;
  }
};

export const getLoan = async (loanId) => {
  try {
    const docRef = doc(db, "prestamos", loanId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error("Préstamo no encontrado");
  } catch (error) {
    console.error("Error al obtener préstamo:", error);
    throw error;
  }
};

export const updateLoan = async (loanId, updates) => {
  try {
    const docRef = doc(db, "prestamos", loanId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error al actualizar préstamo:", error);
    throw error;
  }
};

export const returnLoan = async (loanId) => {
  try {
    const loanRef = doc(db, "prestamos", loanId);
    const loanSnap = await getDoc(loanRef);

    if (loanSnap.exists()) {
      const loanData = loanSnap.data();

      // Actualizar estado del préstamo
      await updateDoc(loanRef, {
        estado: "devuelto",
        fechaDevolucion: new Date(),
        updatedAt: new Date(),
      });

      // Devolver stock al artículo
      const articleRef = doc(db, "articulos", loanData.articuloId);
      const articleSnap = await getDoc(articleRef);
      if (articleSnap.exists()) {
        await updateDoc(articleRef, {
          stock: articleSnap.data().stock + loanData.cantidad,
          updatedAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error al devolver préstamo:", error);
    throw error;
  }
};

export const deleteLoan = async (loanId) => {
  try {
    await deleteDoc(doc(db, "prestamos", loanId));
  } catch (error) {
    console.error("Error al eliminar préstamo:", error);
    throw error;
  }
};

// Suscripción en tiempo real para préstamos
export const subscribeToLoans = (userId, callback) => {
  let q = collection(db, "prestamos");

  if (userId) {
    q = query(q, where("userId", "==", userId));
  }

  return onSnapshot(q, (snapshot) => {
    const loans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(loans);
  });
};

// Suscripción en tiempo real para artículos
export const subscribeToArticles = (callback) => {
  const q = collection(db, "articulos");

  return onSnapshot(
    q,
    (snapshot) => {
      const articles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(articles);
    },
    (error) => {
      console.error("Error al suscribirse a artículos:", error);
      callback([]);
    },
  );
};

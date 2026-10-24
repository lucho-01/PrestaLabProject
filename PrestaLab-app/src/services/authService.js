import { auth, db } from '../config/fbConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const errorMessages = {
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/email-already-in-use': 'Ya existe una cuenta con este correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
  'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'Error de configuración de la app. Contacta al administrador.',
  'auth/operation-not-allowed': 'El registro con correo no está habilitado.',
};

const getErrorMessage = (errorCode) => {
  return errorMessages[errorCode] || 'Ocurrió un error. Intenta de nuevo.';
};

export const registerUser = async (email, password, name, lastName, phone) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );
    
    await updateProfile(userCredential.user, {
      displayName: `${name.trim()} ${lastName.trim()}`,
    });
    
    await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
      nombre: name.trim(),
      apellido: lastName.trim(),
      telefono: phone.trim(),
      email: cleanEmail,
      createdAt: new Date(),
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error.code) 
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error.code) 
    };
  }
};

export const logoutUser = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error.code) 
    };
  }
};

import { auth } from '../config/fbConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';

const errorMessages = {
  'auth/user-not-found': 'No existe una cuenta con este correo.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/email-already-in-use': 'Ya existe una cuenta con este correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
  'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
  'auth/invalid-credential': 'Credenciales inválidas. Verifica tus datos.',
};

const getErrorMessage = (errorCode) => {
  return errorMessages[errorCode] || 'Ocurrió un error. Intenta de nuevo.';
};

export const registerUser = async (email, password, name, lastName, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: `${name} ${lastName}`,
      phoneNumber: phone,
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
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

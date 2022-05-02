// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBDd44lr7yC-rhGPJs3h7SK4_svhPhknww',
  authDomain: 'netflix-clone-99b69.firebaseapp.com',
  projectId: 'netflix-clone-99b69',
  storageBucket: 'netflix-clone-99b69.appspot.com',
  messagingSenderId: '883169203982',
  appId: '1:883169203982:web:eef834697c3bcfb059695f',
  measurementId: 'G-K4D1C2HJM1',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp() // if our app is not initialized then only initialize it
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }

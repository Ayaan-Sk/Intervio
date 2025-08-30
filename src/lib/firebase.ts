// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'voice-mockup',
  appId: '1:535987919350:web:bc04c98a97cfdd21750fd7',
  storageBucket: 'voice-mockup.firebasestorage.app',
  apiKey: 'AIzaSyCkvk9n7xOdIDB9J18cayXgQ_0xfWvZzso',
  authDomain: 'voice-mockup.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '535987919350',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

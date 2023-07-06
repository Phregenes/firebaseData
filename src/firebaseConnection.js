import { initializeApp } from  'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDD0CfAd9bW2Jf1iojuf12JmfCUkMLrCR8",
    authDomain: "curso-786fc.firebaseapp.com",
    projectId: "curso-786fc",
    storageBucket: "curso-786fc.appspot.com",
    messagingSenderId: "117423564319",
    appId: "1:117423564319:web:16943ae93ac879779f572a",
    measurementId: "G-2HH54WK3BQ"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export { db, auth };
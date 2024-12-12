firebase.initializeApp(firebaseConfig);
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
} from "firebase/auth";
const db = firebase.firestore();

//ahora si es para el metodo de log in
const loginEmailPassword = async () => {
  const loginEmail = txtEmail.value;
  const loginPassword = txtPassword.value;

  const userCredential = await signInWithEmailAndPassword(
    auth,
    loginEmail,
    loginPassword
  );
  console.log(userCredential.user);
};

submit.addEventListener("click", loginEmailPassword);

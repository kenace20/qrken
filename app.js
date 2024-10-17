// configuracion de firebase
const firebaseConfig = {
    apiKey: "AIzaSyARc0PHsIcNf-I73KCxgyd6Xe3iGbKr8XA",
    authDomain: "proken-eb8af.firebaseapp.com",
    projectId: "proken-eb8af",
    storageBucket: "proken-eb8af.appspot.com",
    messagingSenderId: "615696094241",
    appId: "1:615696094241:web:3154e50af4ac8f043f3f60",
    measurementId: "G-76CHS385BD"
};

// se inicializa firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// se referencia al formulario
const formulario = document.getElementById('registro-form');

formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // para que no este por defecto el formulario

    // variables del formulario
    const codigo = document.getElementById('codigo').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const proveedor = document.getElementById('proveedor').value.trim();
    const unidades = parseInt(document.getElementById('unidades').value, 10);

     // agregar el documento a firebase
     db.collection("productos").add({
        codigo: codigo,
        nombre: nombre,
        precio: precio,
        proveedor: proveedor,
        unidades: unidades,
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        alert("Producto guardado con ID: " + docRef.id);
        formulario.reset(); // reinicia el formulario
    })
    .catch((error) => {
        console.error("Error al agregar producto: ", error);
        alert("Hubo un error al guardar el producto. Inténtalo de nuevo.");
    });
});

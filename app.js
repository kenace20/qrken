// configuracion de firebase

const firebaseConfig = {
  apiKey: "AIzaSyDBaoqE5yYMLF25q6ZT14qYbf3BUUZUYME",
  authDomain: "qr-ken.firebaseapp.com",
  projectId: "qr-ken",
  storageBucket: "qr-ken.firebasestorage.app",
  messagingSenderId: "620527498344",
  appId: "1:620527498344:web:5c0c17cdc47708eadeb7dd",
  measurementId: "G-B9BXYL010N",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// referencia al formulario y tabla
const formulario = document.getElementById("registro-form");
const listaEmpleados = document.getElementById("empleados-lista");

// crear empleado
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const puesto = document.getElementById("puesto").value.trim();
  const identificacion = document.getElementById("identificacion").value.trim();

  db.collection("empleados")
    .add({
      nombre: nombre,
      puesto: puesto,
      identificacion: identificacion,
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      alert("Empleado registrado correctamente");
      formulario.reset();
      listarEmpleados();
    })
    .catch((error) => {
      console.error("Error al registrar empleado: ", error);
      alert("Hubo un error al registrar al empleado.");
    });
});

// listar empleados
function listarEmpleados() {
  listaEmpleados.innerHTML = "";
  db.collection("empleados")
    .orderBy("fecha", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const empleado = doc.data();
        const fila = `
          <tr>
            <td>${empleado.nombre}</td>
            <td>${empleado.puesto}</td>
            <td>${empleado.identificacion}</td>
            <td>
              <button onclick="editarEmpleado('${doc.id}')">Editar</button>
              <button onclick="eliminarEmpleado('${doc.id}')">Eliminar</button>
            </td>
          </tr>
        `;
        listaEmpleados.innerHTML += fila;
      });
    });
}

// editar empleado
function editarEmpleado(id) {
  const nuevoNombre = prompt("Nuevo nombre:");
  const nuevoPuesto = prompt("Nuevo puesto:");
  const nuevaIdentificacion = prompt("Nuevo ID:");

  db.collection("empleados")
    .doc(id)
    .update({
      nombre: nuevoNombre,
      puesto: nuevoPuesto,
      identificacion: nuevaIdentificacion,
    })
    .then(() => {
      alert("Empleado actualizado");
      listarEmpleados();
    })
    .catch((error) => {
      console.error("Error al editar empleado: ", error);
    });
}

// eliminar empleado
function eliminarEmpleado(id) {
  if (confirm("¿Estás seguro de eliminar este empleado?")) {
    db.collection("empleados")
      .doc(id)
      .delete()
      .then(() => {
        alert("Empleado eliminado");
        listarEmpleados();
      })
      .catch((error) => {
        console.error("Error al eliminar empleado: ", error);
      });
  }
}

// llamar al listado al cargar
listarEmpleados();

async function consolidarEmpleados() {
  try {
    // obtener todos los empleados
    const empleadosSnapshot = await db.collection("empleados").get();
    const empleados = empleadosSnapshot.docs.map((doc) => doc.data());

    if (empleados.length === 0) {
      alert("No hay empleados para consolidar.");
      return;
    }

    // se consolidan los empleados en un solo documento
    await db.collection("empleadosConsolidados").doc("consolidado").set({
      empleados,
      fechaConsolidacion: new Date(),
    });

    alert("Empleados consolidados correctamente.");
  } catch (error) {
    console.error("Error al consolidar empleados: ", error);
    alert("Error al consolidar empleados: " + error.message);
  }
}

document
  .getElementById("boton-consolidar")
  .addEventListener("click", consolidarEmpleados);

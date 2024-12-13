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

//sanitizar
function cleandata(userinput) {
  return DOMPurify.sanitize(userinput);
}

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

        // Crear fila
        const fila = document.createElement("tr");

        // Crear celdas sanitizadas
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = cleandata(empleado.nombre);
        fila.appendChild(celdaNombre);

        const celdaPuesto = document.createElement("td");
        celdaPuesto.textContent = cleandata(empleado.puesto);
        fila.appendChild(celdaPuesto);

        const celdaIdentificacion = document.createElement("td");
        celdaIdentificacion.textContent = cleandata(empleado.identificacion);
        fila.appendChild(celdaIdentificacion);

        // Crear celda con botones
        const celdaAcciones = document.createElement("td");

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.onclick = () => editarEmpleado(doc.id);
        celdaAcciones.appendChild(botonEditar);

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.onclick = () => eliminarEmpleado(doc.id);
        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaAcciones);

        // Agregar fila a la tabla
        listaEmpleados.appendChild(fila);
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

// Inicializar el lector de QR
const qrReader = new Html5Qrcode("qr-reader");

qrReader.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  (decodedText) => {
    document.getElementById("qr-content").textContent = decodedText;

    const [nombre, identificacion] = decodedText.split(",");
    if (nombre && identificacion) {
      db.collection("empleados")
        .add({
          nombre: nombre.trim(),
          puesto: "No especificado",
          identificacion: identificacion.trim(),
          fecha: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          alert("Empleado registrado desde QR");
          listarEmpleados();
        })
        .catch((error) => {
          console.error("Error al registrar empleado desde QR: ", error);
        });
    } else {
      alert(
        "Código QR inválido. Debe contener nombre e identificación separados por coma."
      );
    }
  }
);

const inputGet1Id = document.getElementById('inputGet1Id')
const inputPostNombre = document.getElementById('inputPostNombre')
const inputPostApellido = document.getElementById('inputPostApellido')
const inputPutId = document.getElementById('inputPutId')
const inputDelete = document.getElementById('inputDelete')
const btnGet1 = document.getElementById('btnGet1')
const btnPost = document.getElementById('btnPost')
const btnPut = document.getElementById('btnPut')
const btnDelete = document.getElementById('btnDelete')
const API_URL = 'https://65417e92f0b8287df1fe69fd.mockapi.io/users'
const alertError = document.getElementById("alert-error");
const results = document.getElementById('results');

async function buscarRegistro() {
    const idGet = inputGet1Id.value.trim();

    try {
        if (idGet === "") {
            const response = await fetch(API_URL);
            const data = await response.json();
            results.innerHTML = '';

            data.forEach((registro) => {
                const registroDiv = document.createElement('div');
                registroDiv.classList.add('div-registro')
                registroDiv.innerHTML = `ID: ${registro.id}<br>NAME: ${registro.name}<br>LASTNAME: ${registro.lastname}`;
                results.appendChild(registroDiv);
            });
        } else {
            const response = await fetch(`${API_URL}/${idGet}`);
            if (response.status === 404) {
                results.textContent = 'Error al obtener los datos';
            } else if (response.ok) {
                const data = await response.json();
                results.innerHTML = `ID: ${data.id}<br>NAME: ${data.name}<br>LASTNAME: ${data.lastname}`;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

btnGet1.addEventListener('click', buscarRegistro);


// Función para mostrar una alerta de error
    function showErrorAlert() {
        alertError.classList.add("show");
    }

    // Función para ocultar la alerta de error
    function hideErrorAlert() {
        alertError.classList.remove("show");
    }


    // Evento para el botón "Agregar"
    btnPost.addEventListener("click", () => {
        hideErrorAlert();
        const nombre = inputPostNombre.value;
        const apellido = inputPostApellido.value;
        if (nombre && apellido) {
            fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: nombre,
                    lastname: apellido,
                }),
            })
                .then(() => {
                    inputPostNombre.value = "";
                    inputPostApellido.value = "";
                    buscarRegistro();
                })
                .catch(() => {
                    showErrorAlert();
                });
        }
    });

// MÉTODO DELETE
async function eliminarRegistro() {
    const idDelete = inputDelete.value.trim();

    try {
        const response = await fetch(`${API_URL}/${idDelete}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            buscarRegistro();
        } else if (response.status === 404) {
            results.textContent = 'Error al eliminar el registro';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

btnDelete.addEventListener('click', eliminarRegistro);

function validarCampos() {
    btnGet1.disabled = inputGet1Id.value.trim() === "";
    btnPost.disabled = inputPostNombre.value.trim() === "" || inputPostApellido.value.trim() === "";
    btnPut.disabled = inputPutId.value.trim() === "";
    btnDelete.disabled = inputDelete.value.trim() === "";
}

function mostrarError() {
    alertError.textContent = "Algo salió mal..."; 
    alertError.style.display = "block";
}

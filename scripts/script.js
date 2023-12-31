const inputGet1Id = document.getElementById('inputGet1Id')
const inputPostNombre = document.getElementById('inputPostNombre')
const inputPostApellido = document.getElementById('inputPostApellido')
const inputPutId = document.getElementById('inputPutId')
const inputDelete = document.getElementById('inputDelete')
const btnGet1 = document.getElementById('btnGet1')
const btnPost = document.getElementById('btnPost')
const btnPut = document.getElementById('btnPut')
const btnDelete = document.getElementById('btnDelete')
const modal = document.getElementById("dataModal");
const modalName = document.getElementById("inputPutNombre");
const modalLastName = document.getElementById("inputPutApellido");
const modalPutBtn = document.getElementById("btnSendChanges");

const API_URL = 'https://65417e92f0b8287df1fe69fd.mockapi.io/users'
const alertError = document.getElementById("alert-error");
const results = document.getElementById('results');


// Función para mostrar una alerta de error
function showErrorAlert() {
    alertError.classList.remove("d-none");
}

// Función para ocultar la alerta de error
function hideErrorAlert() {
    alertError.classList.add("d-none");
}

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
            if (response.status === 500) {
                showErrorAlert();
                results.textContent = 'Error al obtener Usuario, el ID ingresado no existe';
            } else if (response.ok) {
                hideErrorAlert();
                const data = await response.json();
                results.innerHTML = `ID: ${data.id}<br>NAME: ${data.name}<br>LASTNAME: ${data.lastname}`;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

btnGet1.addEventListener('click', buscarRegistro);

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


inputPutId.addEventListener("input", () => {
    if (inputPutId.value.trim() === "") {
        btnPut.disabled = true;
    } else {
        btnPut.disabled = false;
    }
});

inputDelete.addEventListener("input", () => {
    if (inputDelete.value.trim() === "") {
        btnDelete.disabled = true;
    } else {
        btnDelete.disabled = false;
    }
});


//Actualizar
btnPut.addEventListener("click", async function(){
    idPut = inputPutId.value.trim();
    
    modal.classList.add("show");
    modal.style.display = "block";
    try{
        const response = await fetch(`${API_URL}/${idPut}`);
        const data = await response.json();
        modalName.value = data.name;
        modalLastName.value = data.lastname;
    } catch (error){
        console.error("Error: ", error);
    }

});

modalPutBtn.addEventListener("click", async function(){
    try{
        const requestOptions = {
            method: "PUT",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({name: modalName.value, lastname: modalLastName.value})
        }
        const response = await fetch(`${API_URL}/${idPut}`, requestOptions);
        const data = await response.json();

        if (response.ok){
            buscarRegistro();
        }
        for (let i = 0; i < data.length; i) {

            const registroDiv = document.createElement('div');
            registroDiv.classList.add('div-registro')
            registroDiv.innerHTML = `ID: ${data[i].id}<br>NAME: ${data[i].name}<br>LASTNAME: ${data[i].lastname}`;
            results.appendChild(registroDiv);
            
        }
        modal.classList.remove("show");
        modal.style.display = "none";

        
    } catch(error){
        console.error("Error: ", error);
    }
})

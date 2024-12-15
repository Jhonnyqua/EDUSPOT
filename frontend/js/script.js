const API_URL = "http://localhost:3001"; // Cambia si usas otra URL para tu backend

// Registro de usuario
document.getElementById('registerForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('name').value.trim();
    const correo = document.getElementById('email').value.trim();
    const contraseña = document.getElementById('password').value.trim();

    if (!nombre || !correo || !contraseña) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, contraseña })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registro exitoso");
            window.location.href = "login.html"; // Redirige al login
        } else {
            alert(data.message || "Error al registrar el usuario");
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        alert("Ocurrió un error al intentar registrar.");
    }
});

// Inicio de sesión
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const correo = document.getElementById('email').value.trim();
    const contraseña = document.getElementById('password').value.trim();

    if (!correo || !contraseña) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contraseña })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("user_id", data.user_id); // Guardar el user_id en localStorage
            alert("Inicio de sesión exitoso");
            window.location.href = "dashboard.html"; // Redirige al dashboard
        } else {
            alert(data.message || "Error al iniciar sesión");
        }
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        alert("Ocurrió un error al intentar iniciar sesión.");
    }
});

// Crear reserva
document.getElementById('reserveForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const user_id = localStorage.getItem("user_id");
    const espacio = document.getElementById("espacio").value;
    const fecha = document.getElementById("fecha").value;
    const hora_inicio = document.getElementById("hora_inicio").value;
    const hora_fin = document.getElementById("hora_fin").value;

    if (!user_id || !espacio || !fecha || !hora_inicio || !hora_fin) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    console.log("Datos capturados para reserva:", { user_id, espacio, fecha, hora_inicio, hora_fin });

    try {
        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, espacio, fecha, hora_inicio, hora_fin })
        });

        if (response.ok) {
            alert("Reserva creada exitosamente");
            window.location.href = "dashboard.html";
        } else {
            const data = await response.json();
            alert(data.message || "Error al crear la reserva");
        }
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        alert("Ocurrió un error al intentar crear la reserva.");
    }
});

// Mostrar reservas
function mostrarReservas() {
    const user_id = localStorage.getItem("user_id"); // Obtener el user_id almacenado al iniciar sesión

    fetch(`${API_URL}/reservations/${user_id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener reservas");
            }
            return response.json();
        })
        .then((reservations) => {
            const reservationsContainer = document.getElementById("reservations-container");
            reservationsContainer.innerHTML = ""; // Limpiar contenido anterior

            if (reservations.length === 0) {
                reservationsContainer.innerHTML = "<p>No tienes reservas registradas.</p>";
                return;
            }

            // Renderizar cada reserva
            reservations.forEach((reservation) => {
                const reservationElement = document.createElement("div");
                reservationElement.className = "reservation-item";
                reservationElement.innerHTML = `
                    <p><strong>Espacio:</strong> ${reservation.espacio}</p>
                    <p><strong>Fecha:</strong> ${reservation.fecha}</p>
                    <p><strong>Hora de Inicio:</strong> ${reservation.hora_inicio}</p>
                    <p><strong>Hora de Fin:</strong> ${reservation.hora_fin}</p>
                `;
                reservationsContainer.appendChild(reservationElement);
            });
        })
        .catch((error) => {
            console.error(error);
            alert("Error al cargar las reservas");
        });
}


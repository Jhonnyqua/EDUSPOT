const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '102322', // Cambia si tienes una contraseña configurada
    database: 'eduspot', // Nombre de tu base de datos
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Endpoint para registrar usuario
app.post('/auth/register', (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const sql = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)';
    db.query(sql, [nombre, correo, contraseña], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al registrar el usuario' });
        }

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
});

// Endpoint para inicio de sesión
app.post('/auth/login', (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const sql = 'SELECT * FROM usuarios WHERE correo = ?';
    db.query(sql, [correo], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = results[0];
        if (usuario.contraseña !== contraseña) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ 
            message: 'Inicio de sesión exitoso',
            user_id: usuario.id,
            nombre: usuario.nombre 
        });
    });
});

// Endpoint para crear una reserva
app.post("/reservations", (req, res) => {
    const { user_id, espacio, fecha, hora_inicio, hora_fin } = req.body;
  
    const query = "INSERT INTO reservations (user_id, espacio, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [user_id, espacio, fecha, hora_inicio, hora_fin], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al crear la reserva");
      }
      res.status(201).send("Reserva creada exitosamente");
    });
  });
  
// Endpoint para obtener las reservas de un usuario
app.get("/reservations/:user_id", (req, res) => {
    const user_id = req.params.user_id; // Obtiene el user_id desde los parámetros de la URL

    const query = "SELECT * FROM reservations WHERE user_id = ?";
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error("Error al obtener reservas:", err);
            return res.status(500).json({ message: "Error en el servidor" });
        }
        res.status(200).json(results); // Devuelve los resultados
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

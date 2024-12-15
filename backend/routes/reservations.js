// routes/reservations.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta para crear una nueva reserva
router.post('/create', (req, res) => {
    const { user_id, espacio, fecha, hora_inicio, hora_fin } = req.body;
    const query = 'INSERT INTO reservations (user_id, espacio, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [user_id, espacio, fecha, hora_inicio, hora_fin], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Reserva creada');
    });
});

// Ruta para obtener reservas de un usuario
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    const query = 'SELECT * FROM reservations WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

module.exports = router;

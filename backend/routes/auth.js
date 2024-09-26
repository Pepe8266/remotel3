const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Esquema de Usuario
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
});

const User = mongoose.model('User', UserSchema);

// Panel de administración
router.get('/', (req, res) => {
    res.send(`
        <h1>Panel de Admin</h1>
        <ul>
            <li><a href="/admin/create-user">Crear nuevo usuario</a></li>
            <li><a href="/admin/change-password">Cambiar contraseña de admin</a></li>
            <li><a href="/auth/logout">Salir</a></li>
        </ul>
    `);
});

// Crear nuevos usuarios
router.post('/create-user', async (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin') {
        return res.status(400).send('No puedes modificar al usuario admin');
    }

    try {
        const newUser = new User({ username, password, role: 'user' });
        await newUser.save();
        res.send('Usuario creado');
    } catch (err) {
        res.status(500).send('Error creando usuario');
    }
});

// Cambiar contraseña del admin
router.post('/change-password', async (req, res) => {
    const { password } = req.body;

    try {
        await User.updateOne({ username: 'admin' }, { password });
        res.send('Contraseña actualizada');
    } catch (err) {
        res.status(500).send('Error actualizando contraseña');
    }
});

module.exports = router;

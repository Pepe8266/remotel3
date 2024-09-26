const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const mqtt = require('mqtt');

// Inicializamos la app de Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://mongo:27017/usersdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Servir archivos estáticos (HTML)
app.use(express.static(path.join(__dirname, 'views')));

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de administración
app.use('/admin', adminRoutes);

// Ruta para el panel de administrador
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/admin.html'));
});

// Ruta para crear usuarios
app.get('/admin/create-user', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/create-user.html'));
});

// Ruta para cambiar la contraseña
app.get('/admin/change-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/change-password.html'));
});

// Ruta para el mando remoto de usuarios no admin
app.get('/remote', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/remote.html'));
});

// Conexión a Mosquitto
const client = mqtt.connect('mqtt://mosquitto:1883');

// Manejamos las acciones del mando remoto
app.post('/remote', (req, res) => {
    const { action, username } = req.body;

    let payload = '';
    switch(action) {
        case 'on_off': payload = 'on_off'; break;
        case 'vol+': payload = 'vol+'; break;
        case 'vol-': payload = 'vol-'; break;
        case 'ch+': payload = 'ch+'; break;
        case 'ch-': payload = 'ch-'; break;
        default: return res.status(400).send('Acción no válida');
    }

    // Publicamos el mensaje a MQTT
    client.publish(`/usuario/${username}`, payload);
    res.send('Mensaje enviado');
});

// Iniciamos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

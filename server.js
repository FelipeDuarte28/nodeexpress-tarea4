const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '123',
    database: 'likeme',
    port: 5432,
    allowExitOnIdle: true,
});

app.get('/posts', async (req, res) => {
    const result = await pool.query('SELECT * FROM posts');
    const posts = result.rows;
    res.json(posts);
});

app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion, likes } = req.body;
    await pool.query(
        'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4)',
        [titulo, img, descripcion, likes]
    );
    res.send("Agregado.");
});

// Configuración para abrir la aplicación de React, ejecutar npm run build antes de ejecutar node server.js
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo. Puerto: ${port}`);
});
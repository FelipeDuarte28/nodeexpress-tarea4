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

////// GET: obtener los registros de los posts
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        const posts = result.rows;
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

////// POST: agrega nuevo registro
app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion } = req.body;
    if (!titulo || !img || !descripcion) {
        res.status(400).send('Hay campos vacíos.');
        return;
    }
    try {
        const result = await pool.query('INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)', [titulo, img, descripcion]);
        res.send("Agregado.");
    } catch (error) {
        res.status(500).send(error);
    }
});

////// PUT: para likes
app.put('/posts/like/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1', [id]);
        res.send("Like entregado");
    } catch ({ code, message }) {
        res.status(code).send(message);
    }
});

////// DELETE: elimina posts
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        res.send("Post eliminado.");
    } catch ({ code, message }) {
        res.status(code).send(message);
    }
});

// Configuración para abrir la aplicación de React, ejecutar npm run build antes de ejecutar node server.js
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo. Puerto: ${port}`);
});
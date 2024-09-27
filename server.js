const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Habilitar CORS para permitir que el frontend (dashboard) haga solicitudes
app.use(cors());

// Conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',     // Cambia esto con tu usuario de PostgreSQL
    host: 'localhost',
    database: 'ventas_db',  // Nombre de tu base de datos
    password: 'Skateforlife123', // Cambia esto con tu contraseña
    port: 5432,             // Puerto por defecto
});

// Ruta para obtener las ventas de los últimos 12 meses
app.get('/ventas/ultimos-12-meses', async (req, res) => {
    try {
        const query = `
            SELECT 
                to_char(fecha, 'Mon') AS mes, 
                SUM(monto) AS total_ventas
            FROM ventas
            WHERE fecha >= (CURRENT_DATE - INTERVAL '12 months')
            GROUP BY to_char(fecha, 'Mon')
            ORDER BY MIN(fecha);
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos de ventas');
    }
});

// Ruta para obtener las ventas del día
app.get('/ventas/dia', async (req, res) => {
    try {
        const query = `
            SELECT SUM(monto) AS total_ventas
            FROM ventas
            WHERE fecha = CURRENT_DATE;
        `;
        const result = await pool.query(query);
        res.json(result.rows[0]);  // Devolvemos el resultado como un objeto JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las ventas del día');
    }
});

// Ruta para obtener las ventas del mes actual
app.get('/ventas/mes-actual', async (req, res) => {
    try {
        const query = `
            SELECT SUM(monto) AS total_ventas
            FROM ventas
            WHERE extract(month from fecha) = extract(month from CURRENT_DATE)
            AND extract(year from fecha) = extract(year from CURRENT_DATE);
        `;
        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las ventas del mes actual');
    }
});

// Ruta para obtener las ventas del mes anterior
app.get('/ventas/mes-anterior', async (req, res) => {
    try {
        const query = `
            SELECT SUM(monto) AS total_ventas
            FROM ventas
            WHERE extract(month from fecha) = extract(month from CURRENT_DATE - INTERVAL '1 month')
            AND extract(year from fecha) = extract(year from CURRENT_DATE - INTERVAL '1 month');
        `;
        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las ventas del mes anterior');
    }
});

// Ruta para obtener las ventas del año actual
app.get('/ventas/anual', async (req, res) => {
    try {
        const query = `
            SELECT SUM(monto) AS total_ventas
            FROM ventas
            WHERE extract(year from fecha) = extract(year from CURRENT_DATE);
        `;
        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las ventas del año actual');
    }
});

// Ruta para obtener las ventas de "Casa Matriz"
app.get('/ventas/casa-matriz', async (req, res) => {
    try {
        const query = `
            SELECT 
                SUM(monto) AS total_ventas,
                to_char(fecha, 'Mon') AS mes
            FROM ventas
            WHERE tienda = 'Casa Matriz'
            GROUP BY to_char(fecha, 'Mon')
            ORDER BY MIN(fecha);
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos de ventas de Casa Matriz');
    }
});

// Ruta para obtener las ventas de "Venta Nuble"
app.get('/ventas/nuble', async (req, res) => {
    try {
        const query = `
            SELECT 
                SUM(monto) AS total_ventas,
                to_char(fecha, 'Mon') AS mes
            FROM ventas
            WHERE tienda = 'Nuble'
            GROUP BY to_char(fecha, 'Mon')
            ORDER BY MIN(fecha);
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos de ventas de Nuble');
    }
});



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
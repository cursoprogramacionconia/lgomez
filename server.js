const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const sqlConfig = {
  user: 'sa',
  password: 'Peivhq11',
  server: 'LGOMEZ',
  database: 'DEMO',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(sqlConfig);
const poolConnect = pool.connect().catch((error) => {
  console.error('Error al conectar con SQL Server:', error);
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' });
  }

  try {
    await poolConnect;

    const request = pool.request();
    request.input('correo', sql.VarChar(255), correo);
    request.input('password', sql.VarChar(255), password);

    const query = `
      SELECT id, nombre_completo, activo
      FROM Usuario
      WHERE correo = @correo AND password = @password
    `;

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    const usuario = result.recordset[0];

    if (usuario.activo !== 1) {
      return res.status(403).json({ mensaje: 'El usuario está inactivo. Contacta al administrador.' });
    }

    return res.json({
      mensaje: 'Inicio de sesión exitoso.',
      usuario: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo
      }
    });
  } catch (error) {
    console.error('Error al validar credenciales:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

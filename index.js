/**
 
 API REST - Administración de Estudiantes
 
 Servidor Express.js que gestiona una lista de estudiantes
 almacenada en un array de JavaScript (datos "quemados",
  sin base de datos).
 
 Endpoints:
GET    /api/estudiantes        -> Listar todos los estudiantes
GET    /api/estudiantes/:id    -> Consultar un estudiante por ID
POST   /api/estudiantes        -> Agregar un nuevo estudiante
PUT    /api/estudiantes/:id    -> Actualizar un estudiante existente
DELETE /api/estudiantes/:id    -> Eliminar un estudiante

 Todas las respuestas son JSON con el código de estado HTTP
 apropiado (200, 201, 400, 404).
 
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para que Express pueda leer JSON en el body
app.use(express.json());

// 
// "BASE DE DATOS" EN MEMORIA (array de JavaScript)
// 
let estudiantes = [
  { id: 1, nombre: 'Ana López', edad: 20, correo: "ana.lopez@gmail.com", telefono: "7134-6787", dirección: {pais:"El Salvador", ciudad:"Usulutan"}, curso: 'Bases de Datos' },
  { id: 2, nombre: 'Carlos Méndez', edad: 22, correo: "carlos.mendez@gmail.com", telefono: "7121-2747", dirección: {pais:"El Salvador", ciudad:"San Miguel"}, curso: 'Bases de Datos' },
  { id: 3, nombre: 'Diana Ruiz', edad: 21,  correo: "diana.ruiz@gmail.com", telefono: "7444-6677", dirección: {pais:"El Salvador", ciudad:"San Salvador"}, curso: 'Programación Web' }
];

// Contador para generar IDs nuevos de forma simple e incremental
let siguienteId = 4;


// FUNCIÓN AUXILIAR: validar el body de un estudiante // 
function validarEstudiante(body) {
  const errores = [];

  if (!body.nombre || typeof body.nombre !== 'string' || body.nombre.trim() === '') {
    errores.push('El campo "nombre" es obligatorio y debe ser texto.');
  }
  if (body.edad === undefined || typeof body.edad !== 'number' || body.edad <= 0) {
    errores.push('El campo "edad" es obligatorio y debe ser un número positivo.');
  }
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!body.correo || typeof body.correo !== 'string' || !regexCorreo.test(body.correo)) {
    errores.push('El campo "correo" es obligatorio y debe tener un formato válido (ejemplo@correo.com).');
  }
   const regexTelefono = /^\+?[0-9\s\-]{7,15}$/;
  if (!body.telefono || typeof body.telefono !== 'string' || !regexTelefono.test(body.telefono)) {
    errores.push('El campo "telefono" es obligatorio y debe ser un número válido de entre 7 y 15 dígitos.');
  }
  if (!body.direccion || typeof body.direccion !== 'string' || body.direccion.trim() === '') {
    errores.push('El campo "direccion" es obligatorio y debe indicar una ubicación válida.');
  }

  if (!body.curso || typeof body.curso !== 'string' || body.curso.trim() === '') {
    errores.push('El campo "curso" es obligatorio y debe ser texto.');
  }

  return errores;
}


// RUTA RAÍZ - información básica del API // 
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API REST de Administración de Estudiantes',
    endpoints: {
      'GET /api/estudiantes': 'Listar todos los estudiantes',
      'GET /api/estudiantes/:id': 'Consultar un estudiante por ID',
      'POST /api/estudiantes': 'Agregar un nuevo estudiante',
      'PUT /api/estudiantes/:id': 'Actualizar un estudiante existente',
      'DELETE /api/estudiantes/:id': 'Eliminar un estudiante',
      'POST /api/estudiantes/reset': 'Restablecer los datos al estado inicial (utilidad para clase)'
    }
  });
});

// 
// POST /api/estudiantes/reset -> Restablece los datos al
// estado inicial SIN reiniciar el servidor. 
// 
app.post('/api/estudiantes/reset', (req, res) => {
  estudiantes = [
    { id: 1, nombre: 'Ana López', edad: 20,  correo: "ana.lopez@gmail.com", telefono: "7134-6787", dirección: {pais:"El Salvador", ciudad:"Usulutan"}, curso: 'Bases de Datos' },
    { id: 2, nombre: 'Carlos Méndez', edad: 22,  correo: "carlos.mendez@gmail.com", telefono: "7121-2747", dirección: {pais:"El Salvador", ciudad:"San Miguel"}, curso: 'Bases de Datos' },
    { id: 3, nombre: 'Diana Ruiz', edad: 21,  correo: "diana.ruiz@gmail.com", telefono: "7444-6677", dirección: {pais:"El Salvador", ciudad:"San Salvador"}, curso: 'Programación Web' }
  ];
  siguienteId = 4;

  res.status(200).json({
    mensaje: 'Datos restablecidos al estado inicial',
    estudiantes
  });
});


// GET /api/estudiantes -> Listar todos los estudiantes// 
app.get('/api/estudiantes', (req, res) => {
  res.status(200).json({
    total: estudiantes.length,
    estudiantes
  });
});


// GET /api/estudiantes/:id -> Consultar un estudiante por ID // 
app.get('/api/estudiantes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const estudiante = estudiantes.find(e => e.id === id);

  if (!estudiante) {
    return res.status(404).json({
      error: `No se encontró ningún estudiante con id ${id}`
    });
  }

  res.status(200).json(estudiante);
});


// POST /api/estudiantes -> Agregar un nuevo estudiante // 
app.post('/api/estudiantes', (req, res) => {
  const errores = validarEstudiante(req.body);

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  const nuevoEstudiante = {
    id: siguienteId++,
    nombre: req.body.nombre,
    edad: req.body.edad,
    curso: req.body.curso
  };

  estudiantes.push(nuevoEstudiante);

  res.status(201).json({
    mensaje: 'Estudiante creado con éxito',
    estudiante: nuevoEstudiante
  });
});


// PUT /api/estudiantes/:id -> Actualizar un estudiante existente// 
app.put('/api/estudiantes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = estudiantes.findIndex(e => e.id === id);

  if (indice === -1) {
    return res.status(404).json({
      error: `No se encontró ningún estudiante con id ${id}`
    });
  }

  const errores = validarEstudiante(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  estudiantes[indice] = {
    id, // el id no cambia
    nombre: req.body.nombre,
    edad: req.body.edad,
    curso: req.body.curso
  };

  res.status(200).json({
    mensaje: 'Estudiante actualizado con éxito',
    estudiante: estudiantes[indice]
  });
});


// DELETE /api/estudiantes/:id -> Eliminar un estudiante// 
app.delete('/api/estudiantes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = estudiantes.findIndex(e => e.id === id);

  if (indice === -1) {
    return res.status(404).json({
      error: `No se encontró ningún estudiante con id ${id}`
    });
  }

  const estudianteEliminado = estudiantes[indice];
  estudiantes.splice(indice, 1);

  res.status(200).json({
    mensaje: 'Estudiante eliminado con éxito',
    estudiante: estudianteEliminado
  });
});


// MANEJO DE RUTA NO ENCONTRADA (404 genérico)// 
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


// INICIAR EL SERVIDOR// 
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
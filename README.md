# Configuraci-n-del-entorno-backend-con-Node.js-npm-y-servidor-con-Express.js-

API REST - Administración de Estudiantes

Servidor Express.js que implementa un CRUD completo (GET, POST, PUT, DELETE)
sobre una lista de estudiantes almacenada en un array de JavaScript en
memoria (sin base de datos).

Importante: los datos NO persisten entre reinicios

Cada vez que detienes el servidor (Ctrl + C) y lo vuelves a iniciar, o
cada vez que --watch lo reinicia automáticamente al guardar un cambio,
el array estudiantes vuelve a su estado inicial de 3 registros.

*******Para poderlo ejecutar primero*******
- Instalación - 
npm install (en tu terminal de comandos)

- Ejecutar con -
  npm start  (Asi tu servidor comienza a escuchar)
  
*****Ejecuta en la barra de direcciones del navegador*****
http://localhost:3000/api/estudiantes 


  *****tabla de endpoints disponibles*****

| Método | Ruta | Descripción | Código éxito | Código error |
|--------|------|-------------|--------------|---------------|
| GET | `/` | Información del API | 200 | — |
| GET | `/api/estudiantes` | Lista todos los estudiantes | 200 | — |
| GET | `/api/estudiantes/:id` | Consulta un estudiante por ID | 200 | 404 si no existe |
| POST | `/api/estudiantes` | Crea un nuevo estudiante | 201 | 400 si faltan campos |
| POST | `/api/estudiantes/reset` | Restablece los datos al estado inicial | 200 | — |
| PUT | `/api/estudiantes/:id` | Actualiza un estudiante existente | 200 | 404 / 400 |
| DELETE | `/api/estudiantes/:id` | Elimina un estudiante y confirma el borrado | 200 | 404 si no existe |

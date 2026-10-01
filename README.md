# API REST – Clínica Veterinaria

API con **Node.js + Express + MongoDB (Mongoose)** para gestionar mascotas y sus expedientes médicos, combinando campos fijos con datos flexibles (no estructurados).

## Estructura

```
src/
├── app.js / server.js        # Express y arranque
├── config/                   # db.js (Mongo) y swagger.js (OpenAPI)
├── models/Mascota.js         # Esquema Mongoose
├── controllers/              # Lógica de los endpoints
├── routes/v1/                # Rutas bajo /api/v1 (con anotaciones Swagger)
├── middleware/errorHandler.js# Manejo global de errores
└── seed/                     # Datos de prueba (data.js + seed.js)
```

## Cómo ejecutar el aplicativo (paso a paso)

Requisitos: [Node.js 18+](https://nodejs.org), Git y MongoDB (local, Docker o Atlas).

```bash
# 1. Clonar el repositorio
git clone https://github.com/emachado0923/veterinaria-mongo.git
cd veterinaria-mongo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env          # Windows: copy .env.example .env

# 4. Tener MongoDB corriendo (elige una opción)
docker run -d --name veterinaria-mongo -p 27017:27017 mongo:7   # con Docker
#   o usar MongoDB local instalado, o Atlas (editar MONGO_URI en .env)

# 5. Cargar los datos (elige una opción)
npm run db:import             # importa la base exportada en ./database (recomendado)
# npm run seed                # o regenera los datos de prueba desde el código

# 6. Iniciar la API
npm start                     # o: npm run dev

# 7. Abrir la documentación
#    http://localhost:3000/api/v1/docs
```

### Base de datos exportada

La carpeta [`database/`](database) contiene los datos de la base `veterinaria` en Extended JSON
(un archivo por colección, p. ej. `database/mascotas.json`, 8 documentos).

| Comando | Acción |
|---|---|
| `npm run db:export` | Exporta todas las colecciones de la base de `MONGO_URI` a `./database` |
| `npm run db:import` | Importa `./database/*.json` (reemplaza el contenido de esas colecciones) |

También se puede importar con las herramientas oficiales:
`mongoimport --uri "<MONGO_URI>" --collection mascotas --file database/mascotas.json --jsonArray --drop`

## Instalación

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
```

### Configuración del `.env`

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (3000) |
| `NODE_ENV` | `development` / `production` |
| `MONGO_URI` | URI de MongoDB (local o Atlas) |
| `AUTO_SEED` | `true` carga los datos de prueba al iniciar en `development` si la colección está vacía |

**Local:** `MONGO_URI=mongodb://127.0.0.1:27017/veterinaria`

**MongoDB Atlas** (cuenta autorizada: `emachado0923@gmail.com`): crea un cluster, un usuario de base de datos y permite tu IP en *Network Access*; luego copia la cadena de conexión:
`MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/veterinaria?retryWrites=true&w=majority`

## Ejecución

```bash
npm run seed    # carga datos de prueba (BORRA la colección mascotas)
npm run dev     # desarrollo (recarga automática)
npm start       # producción
```

- Documentación Swagger: **http://localhost:3000/api/v1/docs** (JSON: `/api/v1/docs.json`)
- Health check: `GET /api/v1/health`

## Endpoints (`/api/v1`)

`/pacientes` es un alias exacto de `/mascotas`.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/mascotas` | Lista con filtros y paginación |
| POST | `/mascotas` | Crea una mascota |
| GET | `/mascotas/:id` | Detalle |
| PUT/PATCH | `/mascotas/:id` | Actualiza |
| DELETE | `/mascotas/:id` | Elimina |
| POST | `/mascotas/:id/consultas` | Agrega consulta al historial |
| GET | `/mascotas/estadisticas/diagnosticos` | Diagnósticos por especie (aggregation) |

Formato de respuesta: `{ "success": true, "data": ... }`; errores: `{ "success": false, "message": "...", "errors": [...] }` con códigos 200, 201, 400, 404 y 500.

### Modelo de datos

Campos fijos: `nombre`, `especie`, `raza`, `sexo`, `fechaNacimiento`, `pesoKg`, `propietario{nombre,telefono,email,direccion}`, `etiquetas[]`, `activo`.
Campos flexibles: `metadatosVariables` (objeto libre) e `historialClinico[]` (consultas con `diagnosticos[]` y un objeto libre `metadatos`).

## Pruebas manuales con curl

```bash
# Crear
curl -X POST http://localhost:3000/api/v1/mascotas -H "Content-Type: application/json" -d '{
  "nombre": "Toby", "especie": "perro", "raza": "Beagle", "pesoKg": 11.5,
  "propietario": { "nombre": "Pedro Pérez", "telefono": "+57 300 000 0000" },
  "etiquetas": ["cachorro"],
  "metadatosVariables": { "microchip": "985000111222333", "alergias": ["polen"] },
  "historialClinico": [{
    "motivo": "Vacunación", "diagnosticos": ["sano"],
    "metadatos": { "vacuna": "quíntuple", "lote": "A123" }
  }]
}'

# Listar / detalle
curl "http://localhost:3000/api/v1/mascotas?page=1&limit=5"
curl http://localhost:3000/api/v1/mascotas/<ID>

# Actualizar
curl -X PUT http://localhost:3000/api/v1/mascotas/<ID> -H "Content-Type: application/json" \
  -d '{ "pesoKg": 12.1, "metadatosVariables": { "microchip": "985000111222333", "dieta": { "tipo": "light" } } }'

# Agregar consulta
curl -X POST http://localhost:3000/api/v1/mascotas/<ID>/consultas -H "Content-Type: application/json" \
  -d '{ "motivo": "Cojera", "diagnosticos": ["esguince"], "metadatos": { "temperatura": 38.6 } }'

# Eliminar
curl -X DELETE http://localhost:3000/api/v1/mascotas/<ID>
```

> Nota: `PUT` reemplaza `metadatosVariables` completo si se envía (Mongoose reemplaza el objeto Mixed). Envía el objeto entero.

## Consultas a datos no estructurados

### Vía la API (query string)

```bash
# Por especie y etiquetas dinámicas (deben estar todas)
curl "http://localhost:3000/api/v1/mascotas?especie=perro&etiqueta=crónico,alérgico"

# Por texto dentro de diagnósticos anidados (regex, sin distinguir mayúsculas)
curl "http://localhost:3000/api/v1/mascotas?diagnostico=renal"

# Por atributo dinámico en metadatosVariables (campo anidado con punto)
curl "http://localhost:3000/api/v1/mascotas?meta[alergias]=penicilina"
curl "http://localhost:3000/api/v1/mascotas?meta[dieta.tipo]=hipoalergénica"
curl "http://localhost:3000/api/v1/mascotas?meta[esterilizada]=true"

# Por metadatos dentro de las consultas
curl "http://localhost:3000/api/v1/mascotas?consultaMeta[estadioIRIS]=2"

# Búsqueda general y estadística
curl "http://localhost:3000/api/v1/mascotas?q=gómez"
curl http://localhost:3000/api/v1/mascotas/estadisticas/diagnosticos
```

> En `curl` usa `-g` cuando la URL tenga `[]`, y codifica los caracteres con tilde (`ó` → `%C3%B3`) porque en terminales de Windows se envían en otra codificación y Node responde 400. Ejemplo: `curl -g "http://localhost:3000/api/v1/mascotas?meta[dieta.tipo]=hipoalerg%C3%A9nica"`.

Los valores `true`/`false` y numéricos se convierten automáticamente; las claves que empiezan por `$` se ignoran (evita inyección de operadores).

### Con Mongoose (`Mascota` = `require('./src/models/Mascota')`)

```js
// 1. Diagnóstico anidado (array de strings dentro de un array de subdocumentos)
Mascota.find({ 'historialClinico.diagnosticos': 'displasia de cadera' });

// 2. Consulta que cumple varias condiciones a la vez ($elemMatch)
Mascota.find({
  historialClinico: { $elemMatch: { diagnosticos: /dermatitis/i, 'metadatos.temperatura': { $gte: 38.5 } } }
});

// 3. Valor numérico anidado en metadatos libres
Mascota.find({ 'historialClinico.metadatos.laboratorio.creatinina': { $gt: 2 } });

// 4. Atributo dinámico que existe (o no)
Mascota.find({ 'metadatosVariables.microchip': { $exists: true } });
Mascota.find({ 'metadatosVariables.seguro': { $exists: false } });

// 5. Elemento dentro de un array dinámico
Mascota.find({ 'metadatosVariables.alergias': { $in: ['penicilina', 'pollo'] } });
Mascota.find({ 'metadatosVariables.vacunas': { $elemMatch: { nombre: 'rabia', proxima: { $lt: '2026-12-31' } } } });

// 6. Etiquetas: todas / alguna
Mascota.find({ etiquetas: { $all: ['exótico', 'dental'] } });
Mascota.find({ etiquetas: { $in: ['oncología', 'renal'] } });

// 7. Proyección y orden
Mascota.find({ especie: 'gato' }, 'nombre propietario.nombre etiquetas').sort({ nombre: 1 });

// 8. Agregación: top diagnósticos
Mascota.aggregate([
  { $unwind: '$historialClinico' }, { $unwind: '$historialClinico.diagnosticos' },
  { $group: { _id: '$historialClinico.diagnosticos', casos: { $sum: 1 } } },
  { $sort: { casos: -1 } }, { $limit: 5 }
]);

// 9. Agregación: peso promedio por especie
Mascota.aggregate([{ $group: { _id: '$especie', pesoPromedio: { $avg: '$pesoKg' }, total: { $sum: 1 } } }]);
```

### Con mongosh

```js
use veterinaria
db.mascotas.find({ "historialClinico.diagnosticos": /carcinoma/i })
db.mascotas.find({ "metadatosVariables.dieta.tipo": "hipoalergénica" })
db.mascotas.find({ "historialClinico.metadatos.presionSistolica": { $gt: 160 } }, { nombre: 1, especie: 1 })
```

## Datos de prueba

`npm run seed` inserta 8 mascotas (perro, gato, ave, conejo, reptil) con consultas complejas, metadatos anidados, arrays de objetos (vacunas), valores nulos y campos distintos por especie.

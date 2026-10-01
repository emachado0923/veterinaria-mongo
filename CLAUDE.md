# PROMPT PARA CLAUDE CODE: API REST Veterinaria (Express + MongoDB)

Por favor, actúa como un Desarrollador Backend Senior y crea una aplicación API REST para una **Clínica Veterinaria** utilizando **Node.js, Express y MongoDB (Mongoose)**.

---

## 1. Requisitos Técnicos y Arquitectura

* **Patrón de diseño:** Estructura modular y limpia (Controladores, Modelos, Rutas, Servicios/Middleware).
* **Base de Datos:** MongoDB.
  * Diseña un esquema de Mongoose flexible para **Mascotas / Expedientes Médicos** que aproveche la naturaleza no estructurada de MongoDB. 
  * Incluye campos fijos básicos (`nombre`, `especie`, `raza`, `propietario`) y un objeto/documento embebido flexible (`historialClinico`, `diagnosticos`, `metadatosVariables` o atributos dinámicos) para manejar datos no estructurados según la consulta o tratamiento.
* **Buenas Prácticas de Rutas:**
  * Prefija todas las rutas de la API bajo `/api/v1/` (ejemplo: `/api/v1/mascotas`, `/api/v1/pacientes`).
  * Respuestas HTTP estándar (códigos 200, 201, 400, 404, 500) con formato JSON consistente.
  * Manejo global de errores mediante un middleware dedicado.

---

## 2. Documentación e Integración Swagger

* Integra **Swagger UI** (`swagger-ui-express` y `swagger-jsdoc` o similar).
* Expón la documentación interactiva en la ruta `/api/v1/docs`.
* Documenta detalladamente todos los endpoints del CRUD (parámetros, esquemas de entrada/salida y posibles códigos de respuesta).

---

## 3. Datos de Prueba (Seed)

* Crea un script de *seeding* o inicialización (`npm run seed` o ejecución automática al iniciar en modo dev).
* Debe poblar la base de datos con **datos de prueba realistas** para verificar el funcionamiento de la veterinaria (diferentes especies, consultas médicas complejas, metadatos estructurados y no estructurados).

---

## 4. Configuración del Entorno y Credenciales

* Utiliza un archivo `.env` para gestionar variables de entorno (`PORT`, `MONGO_URI`, etc.).
* Configura la URI de MongoDB para permitir tanto un entorno local como una instancia en la nube (MongoDB Atlas).
* **Nota de contexto para la base de datos:** La cuenta asociada/autorizada de MongoDB es `emachado0923@gmail.com`.

---

## 5. Entregables Esperados

1. **Código fuente completo:** Proyecto listo para ejecutar (`package.json`, servidor Express, modelos Mongoose, rutas v1, controladores y Swagger).
2. **Script de Seeds:** Código para cargar los datos de prueba.
3. **Archivo `README.md` completo que incluya:**
   * Instrucciones de instalación, configuración del `.env` y ejecución.
   * Enlace a la documentación Swagger `/api/v1/docs`.
   * **Sección detallada de consultas (Queries) a MongoDB:**
     * Ejemplos de consultas avanzadas usando la API de Mongoose o sintaxis de MongoDB para buscar dentro de los campos de datos no estructurados (ej. búsqueda por diagnósticos anidados, etiquetas dinámicas, o filtrados por atributos no estrictos).
   * Ejemplos de peticiones `curl` o payloads JSON para probar los endpoints del CRUD manualmente.
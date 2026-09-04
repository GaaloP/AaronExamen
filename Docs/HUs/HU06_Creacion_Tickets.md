# HU06 Creación de tickets 

Como: Agente o Supervisor

Quiero: Crear un ticket dentro del sistema

Para: Poder reportar un hallazgo o bug

---

## Assets:

Diseño en figma de formulario de creación de ticket https://www.figma.com/design/9zrlV8TENgr4d9UjbmbPRP/Login-%7C-Web-Login-%7C-ziontutorial.com--Community-?node-id=1-21&t=BzHcEcXhCqxhPQ6p-0

---

## Notas técnicas:

* **Manejo de Catálogos:**
  * Los catálogos de **Categoría** y **Estado** están **hardcodeados en el frontend**
  * El catálogo de **Agentes** (para asignar tickets) se obtiene mediante consulta al backend (`GET /api/v1/agents/`)
* **Endpoint Catálogo de Agentes (solo Supervisor):** `GET /api/v1/agents/`
  * **Headers:** `Authorization: Bearer <token>`
  * **Respuesta Exitosa (200):** Devuelve un arreglo de objetos `[ { "uuid": "string", "fullName": "string" } ]`
  * **Error 403:** Si un Agente intenta consultar este endpoint
* **Endpoint Creación de Ticket:** `POST /api/v1/tickets`
  * **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
  * **Payload (Request Body):**
    ```json
    {
      "category": "string",
      "description": "string",
      "assignedToUuid?": "string"
    }
    ```
  * **Regla de Negocio:**
    * Si la petición la realiza un **Agente**, el campo `assignedToUuid` **no debe enviarse en el body**. El backend se encarga de asignar automáticamente el ticket al mismo agente basándose en el token
    * Si la petición la realiza un **Supervisor**, se debe incluir en `assignedToUuid` el id del agente seleccionado
* **Respuesta Exitosa (HTTP 201):**
  ```json
  {
    "statusCode": 201,
    "data": {
      "uuid": "string",
      "ticketCode": "string",
      "category": "string",
      "description": "string",
      "assignedTo": {
        "uuid": "string",
        "fullName": "string"
      },
      "createdAt": "string (ISO 8601)",
      "createdBy": {
        "uuid": "string",
        "fullName": "string"
      },
      "updatedAt": "string (ISO 8601)",
      "status": "string",
      "closedAt": "string (ISO 8601)"
    }
  }

---

## Notas de QA:

---

## Criterios de aceptación:

## AC1: Campos en nuevo ticket

- Numero de ticket: autocompletado (TCK-####)
- Categoria: lista cerrada con las siguientes opciones
    - Soporte técnico
    - Facturación
    - Cuenta
    - Otro
- Estado: el estado en el que se encuentra el ticket (en creación se mantiene por default en abierto).
    Los tickets nacen siempre en estado abierto y el flujo los pasa a "En proceso" cuando se asignan y a "Cerrado" cuando se concluyen, podiendo reabrise en casos de edicion
- Descripcion: Breve resumen de lo que es o lo que causa la incidencia

## AC2: Validaciones en campos para que no esten vacios

- Un ticket debe tener todos sus campos llenados para poderse abrir, en caso de que un campo este VACIO aparecera una validacion debajo del campo faltanque que diga "El campo {nombre del campo faltante} es obligatorio"

## AC3: Ticket creado por supervisor o agente

- Tanto un Agente como un Supervisor pueden crear un ticket nuevo, pero no de la misma forma. Si lo crea un Agente, el ticket queda asignado automáticamente a ese mismo Agente, no puede asignárselo a otro. Si lo crea un Supervisor, elige a qué Agente se lo asigna en el momento de crearlo.
- El backend debe rechazar cualquier intento de un Agente de crear un ticket asignado a otra persona, aunque el frontend no lo permita en la pantalla.


## AC4: Diseño UI y RN

- El diseño, estetica y estructura del formulario deben de seguir el diseño del figma
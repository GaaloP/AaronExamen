# HU07 Edición de tickets 

Como: Agente o Supervisor

Quiero: Editar un ticket ya existente

Para: Poder corregir o cambiar datos dentro del ticket

---

## Assets:

Diseño en figma de formulario de edición de ticket https://www.figma.com/design/9zrlV8TENgr4d9UjbmbPRP/Login-%7C-Web-Login-%7C-ziontutorial.com--Community-?node-id=1-21&t=BzHcEcXhCqxhPQ6p-0

---

## Notas técnicas:

* **Endpoint 1: Editar Datos del Ticket** (`PATCH /api/v1/tickets/:uuid`)
  * **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
  * **Payload (Request Body):**
    ```json
    {
      "category?": "string",
      "description?": "string",
      "assignedToUuid?": "string",
      "comment?": "string"
    }
    ```
  * **Respuesta Exitosa (HTTP 200):** Retorna el objeto completo del ticket actualizado (`uuid`, `ticketCode`, `category`, `description`, `assignedTo`, `status`, `updatedBy`, `updatedAt`, `closedAt`)
  * **Manejo de Errores de Edición:**
    * **HTTP 400 (Petición inválida):** Body con formato no válido
    * **HTTP 401 (No autorizado):** Token caducado, ausente o inválido
    * **HTTP 403 (Acceso denegado):** Cuando un Agente intenta reasignar el ticket o editar tickets que no tiene asignados
    * **HTTP 404 (No encontrado):** El ticket con el `uuid` proporcionado no existe en la BD
    * **HTTP 409 (Conflicto):** Cuando un Supervisor intenta editar un ticket que se encuentra en estado **cerrado** (debe reabrirse primero)
    * **HTTP 500 (Error interno):** Error del servidor

* **Endpoint 2: Cambio de Estado del Ticket** (`PATCH /api/v1/tickets/:uuid/status`)
  * **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
  * **Payload (Request Body):**
    ```json
    {
      "status": "string",
      "comment?": "string"
    }
    ```
  * **Reglas de Transición de Estado:**
    * Abierto $\rightarrow$ En progreso
    * En progreso $\rightarrow$ Cerrado
    * En progreso $\rightarrow$ Abierto
    * Cerrado $\rightarrow$ En progreso (Exclusivo para rol Supervisor)
  * **Manejo de Errores en Cambio de Estado:**
    * **HTTP 403 (Acceso denegado):** Cuando un Agente intenta cambiar el estado de un ticket que no tiene asignado.
    * **HTTP 409 (Conflicto):** Si el estado intenta pasar directo de "Abierto" a "Cerrado", de "Cerrado" a "Abierto", o incumple las reglas de transición permitidas.

---

## Criterios de aceptación:

## AC1: Campos editables (categoría y descripcion)

- Al editar un ticket los campos editables para un agente son categoría, descripcion y estado (estado solo puede ser cambiado a cerrado)
- Ademas de categoría y descripcion, un supevisor tambien puede editar el estado no solo a cerrado sino tambien reabrirlo (en proceso, abierto)
- El campo numero de ticket debe aparecer como deshabilitados para edicion para ambos roles

## AC2: Permisos de edición de tickets

- Agente solo puede editar tickets propios
- Supervisor puede editar todos los tickets y reasignarlos

## AC3: Edicion de tickets por estado

- Los tickets con el estado "cerrado" no pueden editarse, deben reabrirse primero
- Los tickets con estados "abierto" y "en proceso" pueden editarse en cualquier momento

## AC4: Acceso a pantalla de edicion de tickets

- Se accede a la pantalla comprendida een esta historia por medio del icono "editar" presentre al dar click al detalle de un ticket.
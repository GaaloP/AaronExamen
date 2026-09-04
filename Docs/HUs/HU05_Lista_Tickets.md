# HU05 Lista de Tickets

Como: Agente o Supervisor

Quiero: Visualizar una tabla de tickets y filtrarlos por estado del ticket.

Para: Identificar el status de cada uno y gestionar la información de acuerdo a mi rol.

---

## Criterios de aceptación:

## AC1: Tabla de tickets

 El dashboard debe de mostrar los tickets obtenidos mediante una tabla construida por Material UI

## AC2: Información por ticket

Cada ticket debería mostrar:
- Número de ticket
- Categoría
- Estado
- Agente asignado


## AC3: Filtro por estado de ticket

El usuario (Agente o Supervisor)  puede filtrar la lista por: Todos, abiertos, en progreso y cerrados.


## AC4: Lista vacía

Si no hay elementos para esa lista desde el backend, debe de verse un mensaje explicativo "No se encontraron tickets" 

## AC5: Mensaje de error
Si la consulta falla, debe mostrarse un mensaje de error "Error al cargar los elementos" 

## AC6: Datos reales
La tabla debe contener información real desde el backend sin datos hardcodeados en el frontend 

## AC7: Acciones por Rol
Si el usuario corresponde a agente , la información recibida y mostrada debe corresponder únicamente a sus tickets, si es supervisor, debe poder visualizar todos los tickets.

## AC8: Detalle
El usuario debe poder seleccionar cualquier ticket de la tabla y ver el detalle de cada uno.

## Notas técnicas:

* **Método y Endpoint:** `GET /api/v1/tickets`
* **Headers:** `Authorization: Bearer <token>`
* **Query Params:** `page`, `limit`, `status`
* **Body:** No contiene body.
* **Restricción por Rol:** El backend filtra los datos automáticamente basándose en el token suministrado (un agente recibirá únicamente sus tickets asignados; un supervisor obtendrá el listado global).
* **Respuesta Exitosa (HTTP 200):**
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "uuid": "string",
        "ticketCode": "number",
        "category": "string",
        "status": "string",
        "assignedTo": {
          "uuid": "string",
          "fullName": "string"
        }
      }
    ],
    "meta": {
      "total": "number",
      "page": "number",
      "limit": "number",
      "totalPages": "number",
      "hasPrevPage": "bool",
      "hasNextPage": "bool"
    }
  }
Manejo de Respuestas de Error:  HTTP 400 (Petición inválida): Se retorna si los parámetros de búsqueda (query params) contienen datos no válidos.HTTP 401 (No autenticado): El token no existe, expiró o tiene formato incorrecto[cite: 4].HTTP 500 (Error interno): Error del servidor al procesar la solicitud
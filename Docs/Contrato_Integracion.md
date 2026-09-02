# Contrato de Integración Examen 2

**Documento redactado por:**

Gael de Jesús Posada Hérnandez

**29/08/2026**

v1.0.3

## HU01 Lista de tickets

### Visualizar los tickets paginados y con filtro (Agente con restriccion, Supervisor total)

**Regla de negocia**

El `ticketCode` no es un identificador en bd del ticekt, solo es un dato para visualización del usuario

**Método y ruta:**

`GET /api/v1/tickets`

**Query Params:**

- page
- limit
- status

**Headers:**

- Authorization: Bearer `<token>`

**Body:**

El endpoint no contiene body.

**Response 200:**

Cuando la operación es exitosa
```json
{
  "tickets": [
    {
      "uuid": "string (uuid)",
      "ticketCode": "int",
      "category": "string (enum Category)",
      "status": "string (enum Status)",
      "assignedTo": "string (user.fullName)",			
    }
  ],
  "pagination": {
    "totalTickets": "int",
    "ticketsCount": "int",
    "currentPage": "int",
    "ticketsPerPage": "int"
  }
}
```

**Response 400:**

Cuando los query params son incorrectos o el formato es inadecuado
```json
{
  "statusCode": 400,
  "error": "Petición inválida",
  "message": "Los parámetros de búsqueda contienen valores no válidos."
}
```

**Response 401:**

Cuando el token no existe, está caducado, o tiene formato incorrecto
```json
{
  "statusCode": 401,
  "error": "No autenticado",
  "message": "El token de autenticación no fue proporcionado o ha expirado."
}
```

**Response 500:**

Cuando ocurre un error general del servidor.
```json
{
  "statusCode": 500,
  "error": "Error interno del servidor",
  "message": "Ocurrió un error inesperado al procesar la solicitud."
}
```

## HU02 Detalle de ticket e historial

### Visualizar detalle del ticket e historial

**Método y ruta:**

`GET /api/v1/tickets/:uuid`

**Headers:**

- Authorization: Bearer `<token>`

**Body:**

Este endpoint no contiene body.

**Response 200:**

Cuando la operación es exitosa
```json
{
  "ticket": {
    "uuid": "string (uuid)",
    "ticketCode": "int",
    "category": "string (enum Category)",
		"description": "string",
    "assignedTo": "string (user.fullName)",
    "status": "string (enum Status)",
    "history": [
      {
        "date": "string (ISO 8601)",
        "editedBy": "string (user.fullName)", 
        "field": "string",
        "prevValue": "string",
        "newValue": "string",
        "comment?": "string"
      }
    ]
  }
}
```

**Response 400:**

Cuando el uuid es de un formato incorrecto
```json
{
  "statusCode": 400,
  "error": "Petición inválida",
  "message": "Los parámetros de búsqueda contienen valores no válidos."
}
```

**Response 401:**

Cuando el token no existe, está caducado, o tiene formato incorrecto
```json
{
  "statusCode": 401,
  "error": "No autenticado",
  "message": "El token de autenticación no fue proporcionado o ha expirado."
}
```

**Response 403:**

Cuando el uuid es correcto y se encuentra en la db, es un agente sin permiso para acceder a ese ticket
```json
{
  "statusCode": 403,
  "error": "Acceso denegado",
  "message": "No cuentas con los permisos necesarios para acceder a este recurso."
}
```

**Response 404:**

Cuando en la db no existe ningun ticket con el uuid solicitado
```json
{
  "statusCode": 404,
  "error": "No encontrado",
  "message": "Ticket con uuid ${uuid} no encontrado."
}
```

**Response 500:**

Cuando ocurre un error general del servidor.
```json
{
  "statusCode": 500,
  "error": "Error interno del servidor",
  "message": "Ocurrió un error inesperado al procesar la solicitud."
}
```

### Visualizar catálogo de agentes (para asignar y reasignar en un ticket)

**Método y ruta:**

`GET /api/v1/agents/`

**Headers:**

- Authorization: Bearer `<token>`

**Body:**

Este endpoint no contiene body.

**Response 200:**

Cuando la operación es exitosa

```json
{
  "agents": [
    {
      "uuid": "string (uuid)",
      "fullName": "string"
    }
  ]
}
```

**Response 400:**

Cuando la url contiene query params
```json
{
  "statusCode": 400,
  "error": "Petición inválida",
  "message": "Los parámetros contienen valores no válidos."
}
```

**Response 401:**

Cuando el token no existe, está caducado, o tiene formato incorrecto
```json
{
  "statusCode": 401,
  "error": "No autorizado",
  "message": "El token de autenticación no fue proporcionado o ha expirado."
}
```

**Response 403:**

Cuando es un agente intentando acceder al endpoint
```json
{
  "statusCode": 403,
  "error": "Acceso denegado",
  "message": "No cuentas con los permisos necesarios para acceder a este recurso."
}
```

**Response 500:**

Cuando ocurre un error general del servidor.
```json
{
  "statusCode": 500,
  "error": "Error interno del servidor",
  "message": "Ocurrió un error inesperado al procesar la solicitud."
}
```

## HU03 Dashboard de métricas

### Visualizar información de métricas

**Método y ruta:**

`GET /api/v1/metrics`

**Headers:**

- Authorization: Bearer `<token>`

**Body:**

Este endpoint no contiene body.

**Response 200:**

Cuando la operación es exitosa
```json
{
  
  "mwtricData": {
    "openedTicketsCount": "int",
    "inProgressTicketsCount": "int",
    "closedTicketsCount": "int",
    "averageSolutionTime": "int"
  }
}
```

**Response 400:**

Cuando la url contiene query params
```json
{
  "statusCode": 400,
  "error": "Petición inválida",
  "message": "Los parámetros de búsqueda contienen valores no válidos."
}
```

**Response 401:**

Cuando el token no existe, está caducado, o tiene formato incorrecto
```json
{
  "statusCode": 401,
  "error": "No autenticado",
  "message": "El token de autenticación no fue proporcionado o ha expirado."
}
```

**Response 403:**

Cuando se trata de un agente intentando acceder a este endpoint
```json
{
  "statusCode": 403,
  "error": "Acceso denegado",
  "message": "No cuentas con los permisos necesarios para acceder a este recurso."
}
```

**Response 500:**

Cuando ocurre un error general del servidor.
```json
{
  "statusCode": 500,
  "error": "Error interno del servidor",
  "message": "Ocurrió un error inesperado al procesar la solicitud."
}
```

## HU Login

### Iniciar sesión

**Método y ruta:**

`POST /api/v1/auth/login`

**Headers:**

- Content-Type: application/json

**Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200:**

Cuando la operación es exitosa
```json
{
  "logionData": {
    "accessToken": "string",
    "expiresIn": "int",
    "user": {
      "role": "string",
      "fullName": "string",
      "uuid": "string (uuid)",
    }
  }
}
```

**Response 400:**

Cuando el contenido del body es incorecto
```json
{
  "statusCode": 400,
  "error": "Petición inválida",
  "message": "Los parámetros contienen valores no válidos."
}
```

**Response 401:**

Cuando las credenciales ingresadas no existen en la DB
```json
{
  "statusCode": 401,
  "error": "No autorizado",
  "message": "Las credenciales son incorrectas"
}
```

**Response 500:**

Cuando ocurre un error general del servidor.
```json
{
  "statusCode": 500,
  "error": "Error interno del servidor",
  "message": "Ocurrió un error inesperado al procesar la solicitud."
}
```

## HU06 Creación de Tickets

### Subir nuevo Ticket

**Regla de negocio:**

Si es creado por un agente, no se incluye el `assignedToUuid` en el body, se toma del token. Si es un supervisor si debe incluir el `assignedToUuid`.

El `ticketCode` no es un identificador en bd del ticekt, solo es un dato para visualización del usuario

**Método y ruta:**

`POST /api/v1/tickets`

**Headers:**

- Authorization: Bearer `<token>`
- Content-Type: application/json

**Body:**

```json
{
  "category": "string (enum Category)",
  "description": "string",
  "assignedToUuid?": "string (uuid)"
}
```

**Response 201:**

Registro creado con éxito
```json
{
  "statusCode": 201,
  "data": {
    "uuid": "string (uuid)",
    "ticketCode": "string",
    "category": "string (enum Category)",
    "description": "string",
		"assignedTo": "string (user.fullName)",
		"createdAt": "string (ISO 8601)",
    "createdBy": "string (user.fullName)",
		"status": "string (enum Status)",
    "closedAt": "string (ISO 8601)",
  }
}
```

**Response 400:**

Cuando el body es incorrecto
```json
{
  "statusCode": 400,
  "error": "Petición inválida",
  "message": "Los parámetros contienen valores no válidos."
}
```

**Response 401:**

Cuando el token no existe, está caducado, o tiene formato incorrecto
```json
{
  "statusCode": 401,
  "error": "No autorizado",
  "message": "Las credenciales son incorrectas"
}
```

**Response 403:**

Cuando un agente intenta asignar el ticket a alguien (el back asigna automaticamente a sí mismo basado en el tocken, por lo tanto el assignedTo debe ser null).
```json
{
  "statusCode": 403,
  "error": "Acceso denegado",
  "message": "No cuentas con los permisos necesarios para crear este recurso."
}
```

**Response 404:**

Cuando el body contiene en assignedTo un agente que no existe en la db
```json
{
  "statusCode": 404,
  "error": "No encontrado",
  "message": "Agente asignado con uuid ${uuid} no encontrado."
}
```

**Response 500:**

Cuando ocurre un error general del servidor.
```json
{
  "statusCode": 500,
  "error": "Error interno del servidor",
  "message": "Ocurrió un error inesperado al procesar la solicitud."
}
```

## HU Edición de tickets

### Editar datos del ticket

**Método y ruta:**

`PATCH /api/v1/tickets/:uuid`

**Headers:**

- Authorization: Bearer `<token>`
- Content-Type: application/json

**Body:**

```json
{
  "category?": "string",
  "description?": "string",
	"assignedToUuid?": "string (uuid)",
  "comment?": "string"
}
```

**Response 200:**

Cuando la operación es exitosa
```json
{
  "editedTicket": {
    "uuid": "string (uuid)",
    "ticketCode": "int",
    "category": "string (enum Category)",
    "description": "string",
    "assignedTo": "string (user.fullName)",
    "createdAt": "string (ISO 8601)",
    "createdBy":"string (user.fullName)",
		"status": "string (enum Status)",
    "closedAt": "string (ISO 8601)"
  }
}
```

**Response 400:**

Cuando el body es incorrecto
```json
{
  "statusCode": 400,
  "error": "Petición inválida",
  "message": "Los parámetros contienen valores no válidos."
}
```

**Response 401:**

Cuando el token no existe, está caducado, o tiene formato incorrecto
```json
{
  "statusCode": 401,
  "error": "No autorizado",
  "message": "El token de autenticación no fue proporcionado o ha expirado."
}
```

**Response 403:**

Cuando un agente intenta reasignar ticket, o editar tickets que no tiene asignados:
```json
{
  "statusCode": 403,
  "error": "Acceso denegado",
  "message": "No cuentas con los permisos necesarios para crear este recurso."
}
```

**Response 404:**

Cuando la url contiene un uuid que no existe en la db
```json
{
  "statusCode": 404,
  "error": "No encontrado",
  "message": "El ticket con uuid ${uuid} no existe."
}
```

**Response 409:**

Cuando es un supervisor pero el ticket esta en status cerrado
```json
{
  "statusCode": 409,
  "error": "Conflicto de registro",
  "message": "El ticket no se pudo editar porque se encuentra en estado cerrado"
}
```

**Response 500:**

Cuando ocurre un error general del servidor.
```json
{
  "statusCode": 500,
  "error": "Error interno del servidor",
  "message": "Ocurrió un error inesperado al procesar la solicitud."
}
```
  
## No definido ni mencionado en HU

### Cambio de status 
**Psobles tranciciones de status:**
Abierto -> En progreso
En progreso -> Cerrado
Cerrado -> En progreso (Solo supervisor)
En progreso -> Abierto


**Método y ruta:**

`PATCH /api/v1/tickets/:uuid/status`

**Headers:**

- Authorization: Bearer `<token>`
- Content-Type: application/json

**Body:**

```json
{
  "status": "string (enum Status)",
  "comment?": "string"
}
```

**Response 200:**

Cuando la operación es exitosa
```json
{
  
  "editedTicket": {
    "uuid": "string (uuid)",
    "ticketCode": "int",
    "category": "string (enum Category)",
    "description": "string",
    "assignedTo": "string (user.fullName)",
    "createdAt": "string (ISO 8601)",
    "createdBy": "string (user.fullName)",
		"status": "string (enum Status)",
    "closedAt": "string (ISO 8601)"
  }
}
```

**Response 400:**

Cuando el body es incorrecto
```json
{
  "statusCode": 400,
  "error": "Petición inválida",
  "message": "Los parámetros contienen valores no válidos."
}
```

**Response 401:**

Cuando el token no existe, está caducado, o tiene formato incorrecto
```json
{
  "statusCode": 401,
  "error": "No autorizado",
  "message": "El token de autenticación no fue proporcionado o ha expirado."
}
```

**Response 403:**

Cuando un agente intenta editar status de tickets que no tiene asignado o reabrir un ticket que ya estaba cerrado.
```json
{
  "statusCode": 403,
  "error": "Acceso denegado",
  "message": "No cuentas con los permisos necesarios para crear este recurso."
}
```

**Response 404:**

Cuando la url contiene un uuid que no existe en la db
```json
{
  "statusCode": 404,
  "error": "No encontrado",
  "message": "El ticket con uuid ${uuid} no existe."
}
```

**Response 409:**

Cuando el estatus intenta pasar de abierto a cerrado o de cerrado a abierto.
```json
{
  "statusCode": 409,
  "error": "Conflicto de registro",
  "message": "No se pudo editar estado porque no se cumple con la regla de transiciones"
}
```

**Response 500:**

Cuando ocurre un error general del servidor.
```json
{
  "statusCode": 500,
  "error": "Error interno del servidor",
  "message": "Ocurrió un error inesperado al procesar la solicitud."
}
```
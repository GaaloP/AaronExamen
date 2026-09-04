# HU08 Detalle de ticket e historial

Como: Agente o Supervisor

Quiero: Consultar el detalle de un ticket y visualizar su historial de cambios.

Para: Conocer el estado actual del ticket y revisar qué cambios se han realizado sin perder datos históricos.

---

## Notas Técnicas:

* **Método y Endpoint:** `GET /api/v1/tickets/:uuid`[cite: 4]
* **Headers:** `Authorization: Bearer <token>`[cite: 4]
* **Body:** Este endpoint no requiere body[cite: 4].
* **Respuesta Exitosa (HTTP 200):** Devuelve la información detallada del ticket y su historial de modificaciones[cite: 4]:
  ```json
  {
    "statusCode": 200,
    "data": {
      "uuid": "string",
      "ticketCode": "number",
      "category": "string",
      "description": "string",
      "assignedTo": {
        "uuid": "string",
        "fullName": "string"
      },
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)",
      "status": "string",
      "history": [
        {
          "date": "string (ISO 8601)",
          "updatedBy": {
            "uuid": "string",
            "fullName": "string"
          },
          "field": "string",
          "prevValue": "string",
          "newValue": "string",
          "comment": "string"
        }
      ]
    }
  }

```

* **Manejo de Respuestas de Error:**

* **HTTP 400 (Petición inválida):** Se retorna cuando el parámetro `uuid` proporcionado tiene un formato incorrecto.


* **HTTP 401 (No autenticado):** Se incluye si el token de autenticación no fue provisto, expiró o no es válido.


* **HTTP 403 (Acceso denegado):** Ocurre si un usuario con rol "agente" intenta consultar un ticket que no tiene asignado a su perfil.


* **HTTP 404 (No encontrado):** Ocurre cuando el `uuid` especificado no existe dentro de la base de datos.


* **HTTP 500 (Error interno):** Error no esperado en el servidor al intentar obtener la información.





---

## Criterios de aceptación:

## AC1: Información por ticket

Cada ticket debería mostrar:

* Número de ticket
* Categoría
* Estado
* Agente asignado

## AC2: Historial completo

La pantalla debe mostrar todos los registros de cambios de estado asociados al ticket.

## AC3: Conservación del historial

Al agregar un nuevo cambio de estado, el nuevo registro debe agregarse al historial sin eliminar ni sobrescribir los registros anteriores.

## AC4: Datos reales

El historial debe obtenerse del backend real y no de información hardcodeada en el frontend.

## AC5: Actualización

Después de recibir un nuevo cambio correctamente desde el backend, el historial mostrado debe contener tanto el nuevo registro como los registros anteriores.

## AC6: Error

Si ocurre un error al obtener el detalle o historial, debe mostrarse un mensaje de error y una opción para reintentar.

## AC7: Accesos por rol

El agente solo podrá consultar el detalle de los tickets que tiene asignados y el Supervisor podrá consultar los tickets disponibles para su rol.

```

```
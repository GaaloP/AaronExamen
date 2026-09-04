# HU04 Dashboard de métricas

Como: Supervisor

Quiero: visualizar el conteo de tickets por estado y el tiempo promedio de cierre

Para: Ver cuántos tickets hay por estado y el tiempo promedio que tardan en cerrarse

---

## Criterios de aceptación:

## AC1: Acceso

El Dashboard debe de permanecer visible para el usuario Supervisor

## AC2  Conteo de tickets
El Dashboard debe de mostrar la cantidad de Tickets que hay por estado abierto, en progreso y cerrado
## AC3  Tiempo promedio 
El ticket mostrará el tiempo promedio por cada uno

## AC4  Tickets no cerrados
El tiempo promedio de cierre no aplicará para los tickets que no se encuentren cerrados

##  AC5 Actualización
Después de recibir un nuevo cambio correctamente desde el backend, el historial mostrado debe contener tanto el nuevo registro como los registros anteriores.

## AC6 Error
Si ocurre un error al obtener el detalle o historial, debe mostrarse un mensaje de error y una opción para reintentar.

## Notas Técnicas 
* **Método y Endpoint:** `GET /api/v1/metrics`
* **Headers:** `Authorization: Bearer <token>`
* **Query Params / Body:** Este endpoint no recibe parámetros en la URL ni body en la petición.
* **Respuesta Exitosa (HTTP 200):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "openedTicketsCount": "number",
      "inProgressTicketsCount": "number",
      "closedTicketsCount": "number",
      "averageSolutionTime": "number"
    }
  }
Manejo de Respuestas de Error:  HTTP 400 (Petición inválida): Se retorna si la URL contiene query params innecesarios o no válidos.  HTTP 401 (No autenticado): Se retorna si el token de autenticación no fue proporcionado, expiró o no es válido.  HTTP 403 (Acceso denegado): Se retorna si un usuario con rol "agente" intenta acceder a este endpoint (pantalla restringida a supervisores).  HTTP 500 (Error interno): Error inesperado del servidor al procesar la solicitud.  
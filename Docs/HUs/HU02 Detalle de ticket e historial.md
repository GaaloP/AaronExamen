# HU02 Detalle de ticket e historial

Como: Agente o Supervisor

Quiero: Consultar el detalle de un ticket y visualizar su historial de cambios.

Para: Conocer el estado actual del ticket y revisar qué cambios se han realizado sin perder datos históricos.

---

## Criterios de aceptación:

## AC1: Información por ticket

Cada ticket debería mostrar:
- Número de ticket
- Categoría
- Descripción
- Estado actual
- Agente asignado

## AC2  Historial completo
 la pantalla debe desplegar en una lista completa todos los registros de cambios de estado asociados al ticket.

## AC3  Conservación del historial: 
Al agregar un nuevo cambio de estado, el nuevo registro debe agregarse al historial sin eliminar ni sobrescribir los registros anteriores.
Campos a guardar y a mostrar en el historial:
- Fecha y hora del cambio
- Usuario que modificó
- Estado anterior y estado nuevo
- Comentario (Cambio opcional para el usuario)

## AC4  Datos reales
El historial debe obtenerse del backend real y no de información hardcodeada en el frontend. Debe respetar la estructura descrita en las notas técnicas. 

##  AC5 Actualización
Después de recibir un nuevo cambio correctamente desde el frontend, el historial mostrado debe contener tanto el nuevo registro como los registros anteriores. Desde el front se haría el cambio y se enviaría la petición hacia el backend, al hacerse una modificación esta modificación se ve afectada y se afecta la lista del historial con la nueva afectación.

## AC6 Error
En caso de error en la respuesta del backend durante la consulta o actualización, se desplegará el mensaje correspondiente definido en el catálogo de errores del frontend

## AC7  Accesos por rol
El agente solo podrá consultar el detalle de los tickets que tiene asignados y el Supervisor podrá consultar los tickets disponibles para su rol.

## AC8: Reasignación de ticket para Supervisor
La pantalla de detalle debe incluir un botón para reasignar el ticket, el cual debe ser visible y ejecutable únicamente para usuarios con el rol de Supervisor

## Notas de QA
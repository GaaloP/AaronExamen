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
- Estado
- Agente asignado

## AC2  Historial completo
 la pantalla debe mostrar todos los registros de cambios de estado asociados al ticket.

## AC3  Conservación del historial: 
Al agregar un nuevo cambio de estado, el nuevo registro debe agregarse al historial sin eliminar ni sobrescribir los registros anteriores.

## AC4  Datos reales
El historial debe obtenerse del backend real y no de información hardcodeada en el frontend.

##  AC5 Actualización
Después de recibir un nuevo cambio correctamente desde el backend, el historial mostrado debe contener tanto el nuevo registro como los registros anteriores.

## AC6 Error
Si ocurre un error al obtener el detalle o historial, debe mostrarse un mensaje de error y una opción para reintentar.

## AC7  Accesos por rol
El agente solo podrá consultar el detalle de los tickets que tiene asignados y el Supervisor podrá consultar los tickets disponibles para su rol
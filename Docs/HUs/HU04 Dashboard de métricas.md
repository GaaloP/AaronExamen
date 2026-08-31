# HU03 Dashboard de métricas

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
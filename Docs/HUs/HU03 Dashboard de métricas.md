# HU03 Dashboard de métricas

Como: Supervisor

Quiero: visualizar el conteo de tickets por estado y el tiempo promedio de cierre

Para: Ver cuántos tickets hay por estado y el tiempo promedio que tardan en cerrarse

---

## Criterios de aceptación:

## AC1: Acceso

El Dashboard de métricas debe de permanecer visible únicamente para el usuario Supervisor

## AC2  Conteo de tickets
El Dashboard debe de mostrar la cantidad de Tickets que hay por estado (abierto, en progreso y cerrado)

## AC3  Tiempo promedio 
El ticket mostrará el tiempo promedio por cada uno Se hizo una función aparte para las sumatoria y otro criterio para el promedio.
El cálculo del tiempo promedio de cierre de tickets debe realizarse en una función aparte dedicada de forma explícita.
La pantalla mostrará el resultado obtenido de dicho promedio.

## AC4  Tickets no cerrados
El tiempo promedio de cierre no aplicará para los tickets que no se encuentren cerrados.

##  AC5 Actualización
Después de recibir un nuevo cambio correctamente desde el backend, el historial mostrado debe contener tanto el nuevo registro como los registros anteriores.

## AC6 Error
Se debe emplear el catálogo de mensajes de error configurado en el frontend para mostrar las alertas correspondientes ante cualquier falla de comunicación o respuesta del backend

## Notas de QA
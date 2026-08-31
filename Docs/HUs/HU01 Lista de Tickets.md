# HU01 Lista de Tickets

Como: Agente o Supervisor

Quiero: Visualizar una tabla de tickets y filtrarlos por estado del ticket.

Para: Identificar el estatus de cada uno y gestionar la información de acuerdo a mi rol.

---

## Criterios de aceptación:

## AC1: Tabla de tickets

 El dashboard debe de mostrar los tickets obtenidos mediante una tabla construida por Material UI, la obtención de aquellos tickets debe de apegarse a lo especificado en las notas técnicas.

## AC2: Información por ticket

Cada ticket debería mostrar:
- Número de ticket
- Categoría
- Estado
- Agente asignado


## AC3: Filtro por estado de ticket

El usuario (Agente o Supervisor)  puede filtrar la lista por: Todos, abiertos, en progreso y cerrados. Para este filtrado se debe consumir un ednpoint específico detallado en notas técnicas.


## AC4: Lista vacía

Si no hay elementos para esa lista desde el backend, debe de verse un mensaje explicativo en la pantalla "No se encontraron tickets" 

## AC5: Mensaje de error
Generar un catálogo de mensajes en el Frontend, en caso de fallas en las peticiones al backend, se debe desplegar el mensaje correspondiente acorde al catálogo establecido.

## AC6: Acciones por Rol
Agente: La información que ve el agente corresponde únicamente a los tickets que tiene asignados.
Supervisor: Visualiza la totalidad de los tickets.
El filtrado por cada rol debe hacerse de forma obligatoria en el backend a través de JWT.

## AC7: Detalle
El usuario (Agente o Supervisor) debe poder seleccionar cualquier ticket de la tabla y abrirá el modal detallado en la HU02.

## Notas de QA
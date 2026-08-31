# HU Creación de tickets 

Como: Agente o Supervisor

Quiero: Crear un ticket dentro del sistema

Para: Poder reportar un hallazgo o bug

---

## Assets:

Diseño en figma de formulario de creación de ticket https://www.figma.com/design/9zrlV8TENgr4d9UjbmbPRP/Login-%7C-Web-Login-%7C-ziontutorial.com--Community-?node-id=1-21&t=BzHcEcXhCqxhPQ6p-0

---

## Notas técnicas:

- Discutir si conviene obtener catálogos desde el back o harcodealos en front
- Como se obendran lso catalogos, como se guardara la infodel formualrio en el redux?



---

## Notas de QA:

blah blah

---

## Criterios de aceptación:

## AC1: Campos en nuevo ticket

- Numero de ticket: autocompletado (TCK-####)
- Categoria: lista cerrada con las siguientes opciones
    - Soporte técnico
    - Facturación
    - Cuenta
    - Otro
- Estado: el estado en el que se encuentra el ticket (en creación se mantiene por default en abierto).
    Los tickets nacen siempre en estado abierto y el flujo los pasa a "En proceso" cuando se asignan y a "Cerrado" cuando se concluyen, podiendo reabrise en casos de edicion
- Descripcion: Breve resumen de lo que es o lo que causa la incidencia

## AC2: Validaciones en campos para que no esten vacios

- Un ticket debe tener todos sus campos llenados para poderse abrir, en caso de que un campo este VACIO aparecera una validacion debajo del campo faltanque que diga "El campo {nombre del campo faltante} es obligatorio"

## AC3: Ticket creado por supervisor o agente

- Tanto un Agente como un Supervisor pueden crear un ticket nuevo, pero no de la misma forma. Si lo crea un Agente, el ticket queda asignado automáticamente a ese mismo Agente, no puede asignárselo a otro. Si lo crea un Supervisor, elige a qué Agente se lo asigna en el momento de crearlo.
- El backend debe rechazar cualquier intento de un Agente de crear un ticket asignado a otra persona, aunque el frontend no lo permita en la pantalla.


## AC4: Diseño UI y RN

- El diseño, estetica y estructura del formulario deben de seguir el diseño del figma
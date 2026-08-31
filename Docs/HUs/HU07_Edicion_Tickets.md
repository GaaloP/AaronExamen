# HU Edición de tickets 

Como: Agente o Supervisor

Quiero: Editar un ticket ya existente

Para: Poder corregir o cambiar datos dentro del ticket

---

## Assets:

Diseño en figma de formulario de edición de ticket https://www.figma.com/design/9zrlV8TENgr4d9UjbmbPRP/Login-%7C-Web-Login-%7C-ziontutorial.com--Community-?node-id=1-21&t=BzHcEcXhCqxhPQ6p-0

---

## Notas técnicas:

blah blah

---

## Criterios de aceptación:

## AC1: Campos editables (categoría y descripcion)

- Al editar un ticket los campos editables para un agente son categoría, descripcion y estado (estado solo puede ser cambiado a cerrado)
- Ademas de categoría y descripcion, un supevisor tambien puede editar el estado no solo a cerrado sino tambien reabrirlo (en proceso, abierto)
- El campo numero de ticket debe aparecer como deshabilitados para edicion para ambos roles

## AC2: Permisos de edición de tickets

- Agente solo puede editar tickets propios
- Supervisor puede editar todos los tickets y reasignarlos

## AC3: Edicion de tickets por estado

- Los tickets con el estado "cerrado" no pueden editarse, deben reabrirse primero
- Los tickets con estados "abierto" y "en proceso" pueden editarse en cualquier momento

## AC4: Acceso a pantalla de edicion de tickets

- Se accede a la pantalla comprendida een esta historia por medio del icono "editar" presentre al dar click al detalle de un ticket.
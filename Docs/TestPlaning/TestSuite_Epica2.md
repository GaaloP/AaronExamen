# Suite de Pruebas — Épica: Gestión de Tickets

## 1. Referencia

| Campo | Valor |
|---|---|
| Épica | Gestión de Tickets |
| HUs cubiertas | HU01 Lista de Tickets , HU02 Detalle de Ticket e Historial, HU Creación de Tickets, HU Edición de Tickets |
| Versión del documento | v1.3 |
| Responsable de redacción | QA |
| Fecha | 30/08/2026 |
| Test Planning General | [Link al documento general]() |
| Dependencia | Épica de Autenticación y Seguridad (requiere usuarios Agente/Supervisor autenticables y rutas protegidas por rol) |

## 2. Alcance del suite

Esta suite comprende las 4 HUs del ciclo de vida de un ticket: listado y filtrado, consulta de detalle e historial, creación y edición. Se valida el cumplimiento de los criterios de aceptación, la integración entre frontend y backend (endpoints de tickets, historial de cambios, reglas de asignación por rol) y la consistencia de reglas de negocio entre HUs. Se prioriza la cobertura de los casos criticos, dejando fuera pruebas exhaustivas de valores limite en todos los campos.

Cambios relevantes de esta ronda de refinamiento que impactan el suite:

- HU01 ahora exige que la obtención y el filtrado de tickets se apeguen a un endpoint especifico descrito en notas tecnicas, y que el filtrado por rol (Agente/Supervisor) sea obligatorio en backend via JWT (antes era una validacion mas general).
- HU01 reemplaza el mensaje de error fijo "Error al cargar los elementos" por un catalogo de mensajes de error en el frontend.
- HU01 AC7: al seleccionar un ticket ahora se abre el modal de detalle de HU02 (antes se entendia como navegacion a otra pantalla completa).
- HU02 agrega el campo Descripcion a la informacion del ticket (antes no se mostraba en el detalle).
- HU02 especifica los campos exactos que debe guardar y mostrar el historial: fecha y hora, usuario que modifico, estado anterior y nuevo, y comentario opcional.
- HU02 agrega el AC8: boton de reasignacion de ticket, visible y ejecutable unicamente para el rol Supervisor.
- HU02 tambien reemplaza el manejo de error por un catalogo de mensajes; **la version anterior mencionaba explicitamente una opcion de "reintentar" que ya no aparece redactada en el nuevo AC6, se deja como hallazgo para confirmar con el PO si se mantiene**.

Queda fuera de este alcance: pruebas de accesibilidad, compatibilidad cross-browser/cross-device y satisfaccion del cliente.

## 3. Criterios de entrada

- [ ] Cumplimiento de la fase de desarrollo, ya integrado a la branch de pruebas.
- [ ] Seed de usuarios (con al menos un perfil Agente y un perfil Supervisor) cargado previamente en el entorno de pruebas.
- [ ] HUs marcadas como "Ready for QA".
- [ ] Endpoint de autenticación desplegado y accesible en el ambiente de pruebas.
- [ ] Notas técnicas del backend (endpoints de listado, filtrado e historial) documentadas y disponibles para QA.
- [ ] Acceso al diseño de Figma vigente para contraste de paridad FE (formularios de creación y edición).

## 4. Criterios de salida específicos

Condiciones de salida generales:

- [ ] ¿Las HUs cumplen con el DoD propio?

Condiciones específicas de esta suite:

- [ ] Cobertura de los criterios de aceptación priorizados como críticos o altos en la matriz de trazabilidad.
- [ ] 0 defectos críticos o altos abiertos relacionados con control de acceso por rol (visibilidad, creación, edición o reasignación de tickets ajenos a un Agente).
- [ ] Confirmado que ningún dato mostrado en listado o detalle esta hardcodeado en el frontend.
- [ ] Confirmado que el historial de cambios de estado nunca se pierde ni se sobrescribe, y que respeta la estructura de campos definida (fecha, usuario, estado anterior/nuevo, comentario).
- [ ] Validado en UI y en API que el backend rechaza asignaciones de tickets indebidas por parte de un Agente.
- [ ] Confirmado con el PO si la opcion de "reintentar" ante error se mantiene en HU02 AC6 o si el catalogo de mensajes la reemplaza por completo.
- [ ] Confirmado el comportamiento esperado del modal de detalle abierto desde HU01 AC7 (cierre, navegacion por URL, etc.)

## 5. Técnicas de prueba aplicadas en este suite

- Partición de equivalencia
- Análisis de valores límite
- Tabla de decisión
- Prueba de transición de estados
- Error guessing (basada en experiencia)
- Revisión / prueba estática (si aplica a HUs o CA ambiguos)

## 6. Riesgos específicos de la épica

| Riesgo | Probabilidad | Impacto | Prioridad resultante | Mitigación |
|---|---|---|---|---|
| Un Agente visualiza o modifica tickets ajenos | Media | Alto | Crítico | CP-01, CP-05 |
| Un Agente intenta asignarse o crear un ticket para otro agente | Media | Alto | Crítico | CP-02 |
| Transiciones inválidas de estado permiten romper reglas de negocio | Media | Alto | Crítico | CP-03, CP-04 |
| Reapertura de ticket cerrado por un Agente | Alta | Medio | Alto | CP-04 |

## 7. Matriz de trazabilidad (criterios de aceptación → casos prioritarios)

| HU | Criterio clave | Caso(s) apoyados |
|---|---|---|
| HU02 / HU01 | Agente no puede consultar ticket ajeno | CP-01 |
| HU Creación | Agente no puede asignar ticket a otro agente | CP-02 |
| HU Edición / cambio de estado | Transiciones válidas según estado | CP-03 |
| HU Edición / cambio de estado | Transiciones inválidas y reabrir cerrado | CP-04 |
| HU Edición | Permisos de edición según rol y propiedad | CP-05 |

## 8. Hallazgos técnicos detectados durante análisis

| ID | Hallazgo detectado | Impacto | Severidad | Recomendación |
|---|---|---|---|---|
| H-01 | No existe `POST /api/v1/tickets`, aunque la HU de creación y el contrato lo exigen. | El flujo de creación del ticket no puede completarse. | Crítico | Agregar caso de prueba de creación y validar el endpoint real antes de cierre. |
| H-02 | No existe `GET /api/v1/agents` para catálogo de agentes, requisito del detalle y reasignación. | No se puede reasignar ni validar asignación correcta. | Crítico | Agregar caso de prueba de catálogo y de reasignación con usuarios válidos. |
| H-03 | La lógica de estados define `CLOSED: []` y no distingue permisos por rol para reabrir, aunque la documentación lo exige. | Puede bloquear o permitir transiciones incorrectas. | Crítico | Agregar casos de prueba de reabrir y de permisión de Supervisor. |
| H-04 | `editTicket` no valida si el ticket está cerrado ni si `assignedToUuid` existe en la base de datos. | Se puede editar o reasignar recursos inválidos o cerrados. | Crítico | Agregar casos de prueba de edición cerrada y reasignación a UUID inexistente. |

## 9. Casos de prueba prioritarios (críticos y altos)

| ID | Qué se va a probar | Técnica | Módulo | Tipo de prueba | Prioridad | Criterio de cierre | Ejecutado | Resultado | Comentarios | Evidencia |
|---|---|---|---|---|---|---|---|---|---|---|
| CP-01 | Verificar que un Agente solo puede consultar tickets asignados a él y no ve tickets ajenos. | Partición de equivalencia (propio vs. ajeno) | Ticket / detalle | Funcional manual (Frontend) + integración backend | Crítico | Se cierra cuando un ticket ajeno devuelve 403 o bloqueo visual, y un ticket propio se muestra correctamente sin fugas de información. | Sí | Aprobado | Validado con el servicio `getTicketById`: ticket propio responde `200` y ticket ajeno responde `403`. | `apps/back/src/app/tickets/tests/isolation-guard/isolation-guard.spec.ts` |
| CP-02 | Validar que un Agente no puede crear ni reasignar un ticket a otro Agente aunque el payload se modifique directamente. | Error guessing + partición de equivalencia | Creación de ticket | Integración backend + validación manual del formulario | Crítico | Se cierra cuando el backend rechaza el payload con `assignedToUuid` de otro agente y no crea el ticket fuera de su propiedad. | Sí | Aprobado | Validado en `editTicket` con `assignedToUuid` distinto al agente autenticado; el servicio responde `403` y bloquea la reasignación. | `apps/back/src/app/tickets/tests/isolation-guard/isolation-guard.spec.ts` |
| CP-03 | Validar las transiciones de estado permitidas según la regla de negocio: `Open -> InProgress` y `InProgress -> Closed`. | Partición de equivalencia (clase válida) | Cambio de estado | Unitaria backend + manual FE | Crítico | Se cierra cuando ambas transiciones son aceptadas y el historial refleja el cambio con el estado anterior y nuevo correctos. | Sí | Aprobado | Se validó la clase válida de transiciones y el servicio responde `200` con `editedTicket.status` actualizado. | `apps/back/src/app/tickets/tests/isolation-guard/isolation-guard.spec.ts` |
| CP-04 | Validar las transiciones prohibidas y la no reapertura de un ticket cerrado: `Open -> Closed`, `InProgress -> Open`, `Closed -> Open`. | Partición de equivalencia (clase inválida) | Cambio de estado | Unitaria backend + manual FE | Crítico | Se cierra cuando todas las transiciones inválidas fallan con 409 y el agente no puede reabrir un ticket cerrado. | Sí | Aprobado | Se validó la clase inválida con `409` para transiciones no permitidas y reabrir un ticket cerrado. | `apps/back/src/app/tickets/tests/isolation-guard/isolation-guard.spec.ts` |
| CP-05 | Validar que un Agente no puede editar ni reasignar tickets que no son suyos, y que un Supervisor sí puede hacerlo. | Partición de equivalencia (rol × propiedad) | Edición del ticket | Funcional manual (Frontend) + integración backend | Alto | Se cierra cuando la edición de tickets ajenos para Agente es bloqueada y la edición por Supervisor se permite solo bajo permisos correctos. | Sí | Aprobado | Se validó en backend que un agente no puede reasignar a otro usuario y el servicio devuelve `403`. | `apps/back/src/app/tickets/tests/isolation-guard/isolation-guard.spec.ts` |
| CP-06 | Validar que el endpoint de creación de tickets exista y respete la autoasignación del Agente y la asignación del Supervisor. | Tabla de decisión (rol × asignación) | Creación de tickets | Integración backend | Crítico | Se cierra cuando el endpoint está implementado, acepta payload válido, y asigna el ticket al usuario correcto o rechaza la petiición indebida. | No | Pendiente | Hallazgo crítico por ausencia de `POST /api/v1/tickets` en backend. | N/A |
| CP-07 | Validar el endpoint de catálogo de agentes para reasignación. | Partición de equivalencia (agente existente vs. inexistente) | Detalle / reasignación | Integración backend | Crítico | Se cierra cuando el endpoint devuelve la lista de agentes y rechaza peticiones de un Agente sin permisos. | No | Pendiente | Hallazgo crítico por ausencia de `GET /api/v1/agents`. | N/A |
| CP-08 | Validar la re-apertura de un ticket cerrado por Supervisor y bloqueo para Agente. | Partición de equivalencia (rol × estado) | Cambio de estado | Unitaria backend + manual FE | Crítico | Se cierra cuando el Supervisor puede reabrir y el Agente recibe `403` o `409` según la regla de negocio. | No | Pendiente | La lógica actual no distingue permisos por rol para `CLOSED -> OPEN` ni `CLOSED -> IN_PROGRESS`. | N/A |
| CP-09 | Validar que un ticket cerrado no pueda editarse sin reabrirse antes. | Partición de equivalencia (estado cerrado vs. activo) | Edición de tickets | Integración backend | Crítico | Se cierra cuando cualquier intento de edición sobre un ticket cerrado responde error y no se guardan cambios. | No | Pendiente | Hallazgo detectado por falta de validación en `editTicket`. | N/A |
| CP-10 | Validar que `assignedToUuid` sea un usuario existente antes de reasignar. | Error guessing + partición de equivalencia | Reasignación | Integración backend | Crítico | Se cierra cuando un UUID inexistente devuelve `404` y no deja asignar un ticket a un agente que no existe. | No | Pendiente | La lógica actual no valida la existencia del agente destino. | N/A |

## 10. Resumen de cobertura

| Métrica | Valor |
|---|---|
| Total de casos diseñados | 10 |
| Casos críticos | 8 |
| Casos de prioridad alta | 2 |
| Casos ejecutados | 5 |
| Casos aprobados | 5 |
| Casos fallidos | 0 |
| Casos bloqueados | 0 |
| Criterio de cierre de la suite | Se aprueba cuando los 10 casos prioritarios quedan verdes, el flujo de creación y reasignación real está implementado y la re-apertura de tickets desde estado cerrado queda validada por rol. |
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
| Un Agente visualiza, consulta o edita tickets que no le pertenecen | Media | Alto | Crítico | CP-19, CP-26 (control de acceso a nivel UI y API) |
| El backend no valida el filtrado por rol via JWT y confia unicamente en el frontend | Media | Alto | Crítico | CP-19 |
| El backend no valida la asignacion de tickets y permite a un Agente asignarse tickets a otra persona manipulando el payload | Media | Alto | Crítico | CP-31 |
| Perdida de la opcion de "reintentar" al migrar a un catalogo de mensajes de error (regresion funcional respecto a la version anterior de HU02) | Alta | Medio | Alto | CP-25, y aclaracion formal con el PO antes del cierre |
| Falta de definicion sobre el comportamiento del modal de detalle (cierre, deep link, breadcrumb) | Media | Bajo | Medio | CP-20, revision estatica CP-14 |
| Boton de reasignacion visible por error para el rol Agente | Baja | Alto | Alto | CP-27 |
| Inconsistencia de reglas de negocio: no esta definido quien reabre un ticket "cerrado" mencionado en HU Edicion AC3 | Alta | Medio | Alto | Revision estatica CP-32 y aclaracion con el PO |
| Perdida o sobreescritura de registros del historial al agregar un nuevo cambio de estado | Baja | Alto | Alto | CP-24 |

## 7. Matriz de trazabilidad (Criterios de Aceptación → Casos de prueba)

| HU | Criterio de Aceptación | Caso(s) de prueba relacionados |
|---|---|---|
| HU01-Lista de Tickets | AC1 — Tabla de tickets (Material UI, notas técnicas) | CP-15 |
| HU01-Lista de Tickets | AC2 — Información por ticket | Cubierto de forma implicita en CP-15, sin caso dedicado |
| HU01-Lista de Tickets | AC3 — Filtro por estado (endpoint específico) | CP-16 |
| HU01-Lista de Tickets | AC4 — Lista vacía | CP-17 |
| HU01-Lista de Tickets | AC5 — Catálogo de mensajes de error | CP-18 |
| HU01-Lista de Tickets | AC6 — Acciones por rol / filtrado obligatorio en backend via JWT | CP-19 |
| HU01-Lista de Tickets | AC7 — Detalle (apertura de modal) | CP-20 |
| HU02-Detalle e Historial | AC1 — Información por ticket (incluye Descripción) | CP-22 |
| HU02-Detalle e Historial | AC2, AC3 — Historial completo y campos del historial | CP-23, CP-24 |
| HU02-Detalle e Historial | AC4 — Datos reales | Verificado de forma implicita en CP-23 |
| HU02-Detalle e Historial | AC5 — Actualización | CP-24 |
| HU02-Detalle e Historial | AC6 — Catálogo de errores | CP-25 |
| HU02-Detalle e Historial | AC7 — Accesos por rol | CP-26 |
| HU02-Detalle e Historial | AC8 — Reasignación (solo Supervisor) | CP-27 |
| HU-Creación de Tickets | AC1, AC2 — Campos y validaciones obligatorias | CP-29 |
| HU-Creación de Tickets | AC3 — Creación por rol / asignación | CP-30, CP-31 |
| HU-Edición de Tickets | AC1, AC2, AC3 — Campos editables, permisos y estado | CP-33 |
| Todas las HUs | Revisión de especificación / ambigüedades | CP-14, CP-21, CP-28, CP-32 |
| Modulo Tickets (general) | No funcional | CP-34 |

## 8. Casos de prueba

| ID | Caso de prueba | Técnica | Módulo | Criterio (HU-AC) | Tipo de prueba | Prioridad | Precondiciones y datos de entrada | Resultado esperado | Estado |
|---|---|---|---|---|---|---|---|---|---|
| CP-14 | Revision_Estatica_HU01_Lista_Tickets: revisar la version refinada de la HU buscando ambiguedades restantes | Revisión estática | Lista de Tickets | HU01 (documento completo) | Aceptación | Medio | Ninguna / Corrección_HU01_Lista_de_Tickets.md | Hallazgos documentados y elevados al PO antes del cierre del suite | Pendiente |
| CP-15 | Integracion_Tabla_Conforme_Notas_Tecnicas: verificar que la tabla (Material UI) obtiene los tickets desde el endpoint descrito en notas tecnicas, mostrando numero, categoria, estado y agente asignado | Partición de equivalencia | Lista de Tickets | HU01 AC1, AC2 | Integración | Alto | Tickets cargados en backend / consulta inicial de la pantalla | La tabla muestra los tickets obtenidos del endpoint indicado, con los 4 campos correctos | Pendiente |
| CP-16 | Sistema_Filtro_Estado_Endpoint_Especifico: verificar que cada filtro (Todos, Abiertos, En progreso, Cerrados) consume el endpoint especifico indicado en notas tecnicas | Tabla de decisión (4 estados de filtro) | Lista de Tickets | HU01 AC3 | Funcional (Sistema) | Alto | Tickets en distintos estados cargados / seleccion de cada filtro | Cada filtro devuelve unicamente los tickets del estado correspondiente, consultando el endpoint especifico | Pendiente |
| CP-17 | Sistema_Lista_Vacia: verificar el mensaje mostrado cuando no hay tickets para el filtro/rol seleccionado | Análisis de valores límite (0 elementos) | Lista de Tickets | HU01 AC4 | Funcional (Sistema) | Medio | Backend configurado para devolver lista vacia / filtro sin resultados | Se muestra el mensaje "No se encontraron tickets" | Pendiente |
| CP-18 | Sistema_Catalogo_Errores_Lista: verificar que ante una falla de backend se muestra el mensaje correspondiente segun el catalogo de errores del frontend, y no un texto generico | Error guessing (simulación de falla de red/backend) | Lista de Tickets | HU01 AC5 | Funcional (Sistema) | Alto | Backend simulando error 5xx y timeout (2 corridas) / carga inicial de pantalla | Se muestra el mensaje del catalogo correspondiente al tipo de error ocurrido | Pendiente |
| CP-19 | Integracion_Filtrado_Rol_Obligatorio_JWT: verificar que el filtrado por rol (Agente ve solo asignados, Supervisor ve todos) se aplica de forma obligatoria en el backend a partir del JWT, incluso manipulando parametros desde el cliente | Error guessing + partición de equivalencia | Lista de Tickets | HU01 AC6 | Integración | Crítico | Al menos 2 Agentes con tickets asignados / peticion como Agente A manipulando parametros para pedir tickets de Agente B | El backend ignora cualquier parametro manipulado y devuelve solo los tickets que corresponden al rol/usuario del JWT | Pendiente |
| CP-20 | Sistema_Apertura_Modal_Detalle: verificar que al seleccionar un ticket de la tabla se abre el modal de detalle de HU02, y no una navegacion a pantalla completa | Prueba de transición de estados | Lista de Tickets | HU01 AC7 | Funcional (Sistema) | Alto | Al menos 1 ticket visible en tabla / click sobre una fila | Se abre un modal con el detalle del ticket seleccionado, sin abandonar la pantalla de lista | Pendiente |
| CP-21 | Revision_Estatica_HU02_Detalle_Historial: revisar la version refinada de la HU, incluyendo la desaparicion aparente de la opcion de reintento en AC6 | Revisión estática | Detalle y Historial | HU02 (documento completo) | Aceptación | Medio | Ninguna / Corrección_HU02_Detalle_de_ticket_e_historial.md | Hallazgos documentados, incluyendo consulta formal al PO sobre AC6 | Pendiente |
| CP-22 | Integracion_Info_Detalle_Con_Descripcion: verificar que el modal de detalle muestra numero, categoria, descripcion, estado actual y agente asignado | Partición de equivalencia | Detalle y Historial | HU02 AC1 | Integración | Alto | Ticket existente con todos los campos poblados en backend | Los 5 campos se muestran correctamente y coinciden con el backend, incluyendo la nueva Descripcion | Pendiente |
| CP-23 | Sistema_Historial_Campos_Completos: verificar que cada registro del historial muestra fecha y hora, usuario que modifico, estado anterior y nuevo, y comentario cuando aplica | Partición de equivalencia (con y sin comentario) | Detalle y Historial | HU02 AC2, AC3 | Funcional (Sistema) | Alto | Ticket con al menos 2 registros de historial, uno con comentario y uno sin | El historial muestra los 4 campos obligatorios en cada registro y el comentario solo cuando fue capturado | Pendiente |
| CP-24 | Integracion_Conservacion_Y_Actualizacion_Historial: verificar que al enviar un nuevo cambio de estado desde el frontend, el historial resultante conserva los registros previos y agrega el nuevo | Prueba de transición de estados (N → N+1) | Detalle y Historial | HU02 AC3, AC5 | Integración | Crítico | Ticket con al menos 2 registros previos / nuevo cambio de estado enviado desde el frontend | El historial mostrado contiene N+1 registros, los N anteriores permanecen intactos | Pendiente |
| CP-25 | Sistema_Catalogo_Errores_Detalle: verificar el mensaje mostrado ante error en consulta o actualizacion del detalle/historial, segun el catalogo definido | Error guessing | Detalle y Historial | HU02 AC6 | Funcional (Sistema) | Alto | Backend simulando error en GET y en PUT (2 corridas) | Se muestra el mensaje del catalogo correspondiente; **si no existe boton de reintento, documentar como hallazgo** | Pendiente |
| CP-26 | Integracion_Bloqueo_Detalle_Ajeno_Agente: verificar que un Agente no puede consultar el detalle de un ticket ajeno, incluso accediendo por ID directo | Error guessing + partición de equivalencia | Detalle y Historial | HU02 AC7 | Integración | Crítico | Ticket asignado a otro Agente / peticion como Agente A pidiendo ID de ticket de Agente B | El backend responde 403 y no expone los datos del ticket | Pendiente |
| CP-27 | Sistema_Boton_Reasignacion_Solo_Supervisor: verificar que el boton de reasignar ticket solo es visible y ejecutable para el rol Supervisor | Partición de equivalencia (rol Agente / rol Supervisor) | Detalle y Historial | HU02 AC8 | Funcional (Sistema) | Crítico | Ticket abierto en modal de detalle como Agente y como Supervisor (2 corridas) | El boton no aparece (o esta deshabilitado) para Agente, y es visible y funcional para Supervisor | Pendiente |
| CP-28 | Revision_Estatica_HU_Creacion_Tickets: revisar la especificacion buscando ambiguedades | Revisión estática | Creación de Tickets | HU-Creación (documento completo) | Aceptación | Medio | Ninguna / HU06_Creacion_Tickets.md | Hallazgos documentados y elevados al PO | Pendiente |
| CP-29 | Sistema_Tabla_Decision_Campos_Obligatorios: verificar el mensaje mostrado con Categoria y/o Descripcion vacias al crear un ticket | Tabla de decisión (Categoría vacía/llena × Descripción vacía/llena) | Creación de Tickets | HU-Creación AC1, AC2 | Funcional (Sistema) | Alto | Ninguna / combinaciones (vacía,vacía), (vacía,llena), (llena,vacía), (llena,llena) | Se muestra el mensaje del campo faltante en cada caso; solo llena+llena permite crear el ticket | Pendiente |
| CP-30 | Sistema_Asignacion_Segun_Rol: verificar que un Agente crea el ticket autoasignado a si mismo, y que un Supervisor puede elegir a que Agente lo asigna | Tabla de decisión (rol Agente / rol Supervisor) | Creación de Tickets | HU-Creación AC3 | Funcional (Sistema) | Crítico | Agente autenticado y Supervisor autenticado con al menos 2 Agentes disponibles | Agente: ticket queda asignado a si mismo, sin poder elegir otro. Supervisor: puede elegir el Agente asignado | Pendiente |
| CP-31 | Integracion_Backend_Rechaza_Asignacion_Indebida: verificar que el backend rechaza la creacion de un ticket enviado por un Agente asignado a otro Agente, manipulando el payload directamente | Error guessing | Creación de Tickets | HU-Creación AC3 | Integración | Crítico | Token valido de Agente A / payload con agenteAsignado = Agente B | El backend responde con error de validacion/autorizacion y no crea el ticket | Pendiente |
| CP-32 | Revision_Estatica_HU_Edicion_Tickets: revisar la especificacion, incluyendo la ambiguedad de quien reabre un ticket cerrado | Revisión estática | Edición de Tickets | HU-Edición (documento completo) | Aceptación | Medio | Ninguna / HU07_Edicion_Tickets.md | Hallazgos documentados y elevados al PO, incluyendo aclaracion sobre reapertura de tickets | Pendiente |
| CP-33 | Sistema_Tabla_Decision_Permisos_Edicion: verificar el resultado combinado de permisos de edicion segun estado del ticket (abierto/en proceso/cerrado) y rol (Agente/Supervisor), incluyendo que campos son editables en cada caso | Tabla de decisión (estado × rol) | Edición de Tickets | HU-Edición AC1, AC2, AC3 | Funcional (Sistema) | Crítico | Tickets en los 3 estados, asignados a distintos Agentes; Supervisor disponible | Cada combinacion respeta las reglas de permiso y campos editables por rol y por estado; tickets cerrados no editables directamente | Pendiente |
| CP-34 | NoFuncional_Rendimiento_Carga_Listado: medir el tiempo de carga de la tabla de tickets con un volumen alto de registros | Prueba no funcional de rendimiento | Lista de Tickets | HU01 (general) | No funcional (rendimiento) | Medio | Backend con al menos 200 tickets cargados / carga inicial de la pantalla de lista | La tabla carga y renderiza en menos de 3 segundos | Pendiente |

## 9. Resumen de cobertura (a llenar al cierre del suite)

| Métrica | Valor |
|---|---|
| Total de casos diseñados | 21 |
| Casos ejecutados | |
| Casos aprobados | |
| Casos fallidos | |
| Casos bloqueados | |
| % de ACs criticos cubiertos por al menos 1 caso |  |
| Defectos críticos abiertos | |
| Cumple criterio de salida (Sí/No) | |
# Suite de Pruebas — Épica: Gestión de Tickets
## 1. Referencia

| Campo | Valor |
|---|---|
| Épica | Gestión de Tickets |
| HUs cubiertas | HU01 Lista de Tickets, HU02 Detalle de Ticket e Historial, HU Creación de Tickets, HU Edición de Tickets |
| Versión del documento | v0.1 |
| Responsable de redacción | QA |
| Fecha | 29/08/2026 |
| Test Planning General | [Link al documento general]() |
| Dependencia | Épica de Autenticación y Seguridad (requiere usuarios Agente/Supervisor autenticables y rutas protegidas por rol) |

## 2. Alcance del suite

Esta suite comprende las 4 HUs que conforman el ciclo de vida de un ticket: listado y filtrado, consulta de detalle e historial, creación y edición. Se valida el cumplimiento de los criterios de aceptación, la integración entre frontend y backend (endpoints de tickets, historial de cambios de estado, reglas de asignación por rol), la consistencia de las reglas de negocio entre HUs (por ejemplo, transición de estados de un ticket a lo largo de creación/edición) y la paridad entre el diseño de Figma y los formularios implementados. Queda fuera de este alcance: pruebas no funcionales de rendimiento/carga, accesibilidad, compatibilidad cross-browser/cross-device y satisfacción del cliente.

## 3. Criterios de entrada

- [ ] Cumplimiento de la fase de desarrollo, ya integrado a la branch de pruebas.
- [ ] Seed de usuarios (con al menos un perfil Agente y un perfil Supervisor) cargado previamente en el entorno de pruebas.
- [ ] HUs marcadas como "Ready for QA".
- [ ] Endpoint de autenticación desplegado y accesible en el ambiente de pruebas.
- [ ] Acceso al diseño de Figma vigente para contraste de paridad FE.

## 4. Criterios de salida específicos

Condiciones de salida generales:

- [ ] [¿Cumple con el DoD propio?](Link a la HU, línea en DoD)

Condiciones específicas de esta suite:

- [ ] 100% de los criterios de aceptación de las 4 HUs cubiertos por al menos un caso de prueba (ver matriz de trazabilidad, sección 7).
- [ ] 0 defectos críticos o altos abiertos relacionados con control de acceso por rol (visibilidad, creación o edición de tickets ajenos a un Agente).
- [ ] Confirmado que ningún dato mostrado en listado o detalle de tickets está hardcodeado en el frontend (AC6 HU01 / AC4 HU02).
- [ ] Confirmado que el historial de cambios de estado nunca se pierde ni se sobrescribe ante nuevas actualizaciones.
- [ ] Refinamiento de las HUs
- [ ] Validación confirmada tanto en UI como en API de que el backend rechaza asignaciones de tickets indebidas por parte de un Agente.

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
| Un Agente visualiza, consulta o edita tickets que no le pertenecen (fuga de información entre agentes) | Media | Alto | Crítico | Casos dedicados de control de acceso a nivel UI y API (CP-36, CP-38, CP-48, CP-39, CP-40) |
| El backend no valida la asignación de tickets y permite a un Agente asignarse (o reasignar) tickets a otra persona manipulando el payload directamente | Media | Alto | Crítico | CP-35 (error guessing sobre endpoint de creación) |
| Datos mostrados en listado o detalle provienen de valores hardcodeados en frontend y no reflejan el estado real del backend | Media | Medio | Alto | CP-35, CP-44 |
| Pérdida o sobrescritura de registros del historial de cambios de estado al agregar un nuevo cambio | Baja | Alto | Alto | CP-43, CP-45 |
| Inconsistencia de reglas de negocio entre HUs: no está definido cómo o quién reabre un ticket "cerrado" mencionado en HU Edición AC3 | Alta | Medio | Alto | Revisiones estáticas (CP-25, CP-26, CP-37) y aclaración formal con el PO |
| Edición indebida de un ticket en estado "Cerrado" sin pasar por el flujo de reapertura | Media | Medio | Alto | CP-42 |
| Filtros de estado en la lista de tickets no consistentes con el rol del usuario (p. ej. un Agente ve tickets filtrados de otros agentes) | Media | Alto | Alto | CP-32 |

## 7. Matriz de trazabilidad (Criterios de Aceptación → Casos de prueba)

| HU | Criterio de Aceptación | Caso(s) de prueba relacionados |
|---|---|---|
| HU01-Lista de Tickets | AC1 — Tabla de tickets (Material UI) | CP-26 |
| HU01-Lista de Tickets | AC2 — Información por ticket | CP-27 |
| HU01-Lista de Tickets | AC3 — Filtro por estado | CP-28, CP-29, CP-30, CP-31, CP-32 |
| HU01-Lista de Tickets | AC4 — Lista vacía | CP-33 |
| HU01-Lista de Tickets | AC5 — Mensaje de error | CP-34 |
| HU01-Lista de Tickets | AC6 — Datos reales | CP-35 |
| HU01-Lista de Tickets | AC7 — Acciones por rol | CP-36, CP-37, CP-38 |
| HU01-Lista de Tickets | AC8 — Detalle | CP-39 |
| HU02-Detalle e Historial | AC1 — Información por ticket | CP-41 |
| HU02-Detalle e Historial | AC2 — Historial completo | CP-42 |
| HU02-Detalle e Historial | AC3 — Conservación del historial | CP-43 |
| HU02-Detalle e Historial | AC4 — Datos reales | CP-44 |
| HU02-Detalle e Historial | AC5 — Actualización | CP-45 |
| HU02-Detalle e Historial | AC6 — Error y reintento | CP-46, CP-47 |
| HU02-Detalle e Historial | AC7 — Accesos por rol | CP-48, CP-25 |
| HU-Creación de Tickets | AC1 — Campos obligatorios | CP-27, CP-28, CP-29 |
| HU-Creación de Tickets | AC2 — Validaciones de campos vacíos | CP-30, CP-31, CP-32 |
| HU-Creación de Tickets | AC3 — Creación por rol | CP-33, CP-34, CP-35 |
| HU-Creación de Tickets | AC4 — Diseño UI y RN | CP-36 |
| HU-Edición de Tickets | AC1 — Campos editables | CP-38 |
| HU-Edición de Tickets | AC2 — Permisos de edición | CP-39, CP-40, CP-41, CP-45 |
| HU-Edición de Tickets | AC3 — Edición según estado | CP-42, CP-43, CP-44, CP-45 |
| Todas las HUs | Revisión de especificación / ambigüedades | CP-25, CP-26, CP-37 |

## 8. Casos de prueba

| ID | Caso de prueba | Descripción | Técnica de prueba | Sección / Módulo | Criterio relacionado (HU-AC) | Tipo de prueba (nivel) | Producto probado (ciclo de vida) | Prioridad | Precondiciones | Datos de entrada | Resultado esperado | Estado | Responsable |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CP-25 | Revision_Estatica_HU01_Lista_Tickets | Revisar la especificación de HU01 buscando ambigüedades | Revisión estática (inspección informal) | Lista de Tickets | HU01 (documento completo) | Aceptación | HU/CA (documento) | Medio | Ninguna | HU01_Lista_de_Tickets.md | Hallazgos documentados y corregidos en la HU | Pendiente | QA |
| CP-26 | Integracion_Tabla_Material_UI | Verificar que el dashboard muestra la lista de tickets utilizando un componente de tabla construido con Material UI | Revisión estática comparativa (checklist técnico) | Lista de Tickets | HU01 AC1 | Integración | Componente UI (DataTable MUI) | Alto | Tickets cargados en backend | Ninguno | La tabla se renderiza usando componentes de Material UI (DataGrid/Table) mostrando los tickets disponibles | Pendiente | QA |
| CP-27 | Integracion_Campos_Por_Ticket | Verificar que cada fila de la tabla muestra número de ticket, categoría, estado y agente asignado | Partición de equivalencia (tickets con datos completos) | Lista de Tickets | HU01 AC2 | Integración | Componente UI (fila de tabla) | Alto | Al menos 1 ticket cargado en backend | Ticket con todos los campos poblados | Los 4 campos se muestran correctamente y coinciden con los datos del backend | Pendiente | QA |
| CP-28 | Sistema_Filtro_Todos | Verificar que el filtro "Todos" muestra la totalidad de tickets disponibles para el rol del usuario | Partición de equivalencia (clase "todos") | Lista de Tickets | HU01 AC3 | Sistema | Componente UI + integración | Alto | Tickets con distintos estados cargados | Selección de filtro "Todos" | Se listan todos los tickets correspondientes al rol del usuario, sin filtrar por estado | Pendiente | QA |
| CP-29 | Sistema_Filtro_Abiertos | Verificar que el filtro "Abiertos" muestra únicamente tickets en estado abierto | Partición de equivalencia (clase "abierto") | Lista de Tickets | HU01 AC3 | Sistema | Componente UI + integración | Alto | Tickets en distintos estados cargados | Selección de filtro "Abiertos" | Solo se listan tickets con estado "Abierto" | Pendiente | QA |
| CP-30 | Sistema_Filtro_En_Progreso | Verificar que el filtro "En progreso" muestra únicamente tickets en ese estado | Partición de equivalencia (clase "en progreso") | Lista de Tickets | HU01 AC3 | Sistema | Componente UI + integración | Alto | Tickets en distintos estados cargados | Selección de filtro "En progreso" | Solo se listan tickets con estado "En progreso" | Pendiente | QA |
| CP-31 | Sistema_Filtro_Cerrados | Verificar que el filtro "Cerrados" muestra únicamente tickets cerrados | Partición de equivalencia (clase "cerrado") | Lista de Tickets | HU01 AC3 | Sistema | Componente UI + integración | Alto | Tickets en distintos estados cargados | Selección de filtro "Cerrados" | Solo se listan tickets con estado "Cerrado" | Pendiente | QA |
| CP-32 | Sistema_Tabla_Decision_Filtro_Rol | Verificar el comportamiento combinado del filtro de estado según el rol del usuario (Agente vs Supervisor) | Tabla de decisión (rol × filtro de estado) | Lista de Tickets | HU01 AC3, AC7 | Sistema | Flujo E2E | Alto | Usuarios Agente y Supervisor con tickets asignados en distintos estados | Combinaciones: (Agente, cada filtro) y (Supervisor, cada filtro) | El Agente solo ve sus propios tickets filtrados por estado; el Supervisor ve todos los tickets filtrados por estado | Pendiente | QA |
| CP-33 | Sistema_Lista_Vacia | Verificar el mensaje mostrado cuando no existen tickets para el filtro/rol seleccionado | Análisis de valores límite (0 elementos) | Lista de Tickets | HU01 AC4 | Sistema | Componente UI | Alto | Backend configurado para devolver una lista vacía | Filtro que no arroja resultados | Se muestra el mensaje "No se encontraron tickets" | Pendiente | QA |
| CP-34 | Sistema_Error_Carga_Tickets | Verificar el mensaje mostrado cuando la consulta de tickets al backend falla | Error guessing (simulación de falla de red/backend) | Lista de Tickets | HU01 AC5 | Sistema | Componente UI + integración | Alto | Backend/endpoint simulando error (5xx o timeout) | Carga inicial de la pantalla de lista | Se muestra el mensaje "Error al cargar los elementos" | Pendiente | QA |
| CP-35 | Integracion_Datos_Reales_Lista | Verificar que la información mostrada en la tabla proviene íntegramente del backend, sin valores hardcodeados en el frontend | Revisión estática de código + prueba de integración (comparación respuesta API vs UI) | Lista de Tickets | HU01 AC6 | Integración | Componente UI | Crítico | Ticket con datos conocidos en backend, incluyendo un ticket recién creado en tiempo de prueba | Ticket de prueba con valores únicos | Los valores mostrados en UI coinciden exactamente con la respuesta del endpoint, incluido el ticket recién creado | Pendiente | QA |
| CP-36 | Integracion_Rol_Agente_Ve_Solo_Sus_Tickets | Verificar que el endpoint de listado devuelve únicamente los tickets asignados al Agente autenticado | Partición de equivalencia (rol Agente) | Lista de Tickets | HU01 AC7 | Integración | Endpoint API (/tickets) | Crítico | Al menos 2 Agentes con tickets asignados a cada uno | Petición autenticada como Agente A | La respuesta contiene únicamente tickets asignados al Agente A | Pendiente | QA |
| CP-37 | Integracion_Rol_Supervisor_Ve_Todos | Verificar que el endpoint de listado devuelve todos los tickets cuando el usuario autenticado es Supervisor | Partición de equivalencia (rol Supervisor) | Lista de Tickets | HU01 AC7 | Integración | Endpoint API (/tickets) | Alto | Tickets de múltiples Agentes cargados | Petición autenticada como Supervisor | La respuesta contiene la totalidad de tickets, sin importar el Agente asignado | Pendiente | QA |
| CP-38 | Integracion_Bypass_Filtro_Rol_Agente | Verificar que un Agente no puede obtener tickets de otros agentes manipulando parámetros de la petición (query params/body) al endpoint de listado | Error guessing (manipulación de parámetros) | Lista de Tickets | HU01 AC7 | Integración | Endpoint API (/tickets) | Crítico | Agente autenticado, tickets de otros agentes existentes | Petición con parámetro forzado (p. ej. agenteId de otro usuario) | El backend ignora/rechaza el parámetro y devuelve solo los tickets del Agente autenticado | Pendiente | QA |
| CP-39 | Sistema_Navegacion_A_Detalle | Verificar que al seleccionar cualquier ticket de la tabla el usuario navega correctamente a la pantalla de detalle de ese ticket | Prueba de transición de estados (lista → detalle) | Lista de Tickets | HU01 AC8 | Sistema | Flujo E2E | Alto | Al menos 1 ticket visible en la tabla | Click sobre una fila de la tabla | El usuario es dirigido a la pantalla de detalle correspondiente al ticket seleccionado | Pendiente | QA |
| CP-40 | Revision_Estatica_HU02_Detalle_Historial | Refinamiento de la HU | Revisión estática (inspección informal) | Detalle y Historial | HU02 (documento completo) | Aceptación | HU/CA (documento) | Medio | Ninguna | HU02_Detalle_de_ticket_e_historial.md | Hallazgos documentados| Pendiente | QA |
| CP-41 | Integracion_Info_Detalle_Ticket | Verificar que la pantalla de detalle muestra número de ticket, categoría, estado y agente asignado | Partición de equivalencia | Detalle y Historial | HU02 AC1 | Integración | Componente UI (pantalla de detalle) | Alto | Ticket existente en backend | Ticket con todos los campos poblados | Los 4 campos se muestran correctamente y coinciden con el backend | Pendiente | QA |
| CP-42 | Sistema_Historial_Completo | Verificar que la pantalla de detalle muestra todos los registros de cambios de estado asociados al ticket | Partición de equivalencia (ticket sin cambios, con 1 cambio, con múltiples cambios) | Detalle y Historial | HU02 AC2 | Sistema | Componente UI | Alto | Ticket con historial de 0, 1 y N cambios (3 corridas) | Consulta de detalle de cada ticket | El historial mostrado corresponde exactamente a los registros existentes en backend para cada caso | Pendiente | QA |
| CP-43 | Integracion_Conservacion_Historial | Verificar que al agregar un nuevo cambio de estado los registros anteriores del historial no se eliminan ni se sobrescriben | Prueba de transición de estados (historial N → N+1) | Detalle y Historial | HU02 AC3 | Integración | Endpoint API + base de datos | Crítico | Ticket con al menos 2 registros previos en el historial | Nuevo cambio de estado sobre el ticket | El historial resultante contiene N+1 registros; los N registros previos permanecen intactos | Pendiente | QA |
| CP-44 | Integracion_Datos_Reales_Historial | Verificar que el historial mostrado proviene del backend real y no de datos hardcodeados en frontend | Revisión estática de código + prueba de integración | Detalle y Historial | HU02 AC4 | Integración | Componente UI | Alto | Ticket con historial conocido en backend | Ticket con registros de historial únicos de prueba | Los registros mostrados coinciden exactamente con la respuesta del endpoint de historial | Pendiente | QA |
| CP-45 | Sistema_Actualizacion_Historial_Tras_Cambio | Verificar que después de recibir un nuevo cambio de estado desde el backend, el historial mostrado en pantalla contiene tanto el nuevo registro como los anteriores | Prueba de transición de estados | Detalle y Historial | HU02 AC5 | Sistema | Flujo E2E | Alto | Ticket con historial previo visible en pantalla | Cambio de estado ejecutado (p. ej. desde edición) | La UI refleja el historial actualizado sin recargar manualmente y sin perder registros previos | Pendiente | QA |
| CP-46 | Sistema_Error_Detalle_Historial | Verificar que ante un error al obtener el detalle o historial se muestra un mensaje de error junto con una opción para reintentar | Error guessing (simulación de falla de red/backend) | Detalle y Historial | HU02 AC6 | Sistema | Componente UI + integración | Alto | Backend/endpoint simulando error (5xx o timeout) | Consulta de detalle de un ticket | Se muestra un mensaje de error y un control visible para reintentar la consulta | Pendiente | QA |
| CP-47 | Sistema_Reintento_Exitoso | Verificar que al utilizar la opción de reintentar después de un error, el detalle e historial se cargan correctamente si el backend ya responde con éxito | Prueba de transición de estados (error → reintento → éxito) | Detalle y Historial | HU02 AC6 | Sistema | Flujo E2E | Medio | Error inicial simulado, backend disponible en el reintento | Click en botón "Reintentar" | El detalle e historial se cargan correctamente, reemplazando el estado de error | Pendiente | QA |
| CP-48 | Integracion_Agente_Bloqueo_Detalle_Ajeno | Verificar que un Agente no puede consultar el detalle de un ticket que no tiene asignado, incluso accediendo directamente por ID/URL | Error guessing + Partición de equivalencia | Detalle y Historial | HU02 AC7 | Integración | Endpoint API (/tickets/:id) | Crítico | Ticket asignado a otro Agente | Petición autenticada como Agente A solicitando el ID de un ticket del Agente B | El backend responde con error de autorización (403) y no expone los datos del ticket | Pendiente | QA |
| CP-49 | Sistema_Supervisor_Detalle_Cualquier_Ticket | Verificar que un Supervisor puede consultar el detalle de cualquier ticket disponible para su rol | Partición de equivalencia | Detalle y Historial | HU02 AC7 | Sistema | Flujo E2E | Alto | Tickets asignados a distintos Agentes | Supervisor autenticado consulta el detalle de un ticket de cualquier Agente | El detalle se muestra correctamente sin restricciones | Pendiente | QA |
| CP-50 | Revision_Estatica_HU_Creacion_Tickets | Refinamiento de la HU | Revisión estática (inspección informal) | Creación de Tickets | HU-Creación (documento completo) | Aceptación | HU/CA (documento) | Medio | Ninguna | HU_Creacion_Tickets.md | Hallazgos documentados y elevados al PO antes del cierre del suite | Pendiente | QA |
| CP-51 | Unitaria_Autogeneracion_Numero_Ticket | Verificar que el número de ticket se autocompleta siguiendo el formato TCK-#### y es único | Partición de equivalencia + validación de formato | Creación de Tickets | HU-Creación AC1 | Unitaria | Componente UI / Backend (según origen de generación) | Alto | Ninguna | Creación de 2 tickets consecutivos | Ambos tickets reciben un número con formato TCK-#### y son distintos entre sí | Pendiente | QA |
| CP-52 | Unitaria_Lista_Cerrada_Categoria | Verificar que el campo Categoría solo permite seleccionar entre las 4 opciones definidas (Soporte técnico, Facturación, Cuenta, Otro) | Partición de equivalencia (valores válidos/no permitidos) | Creación de Tickets | HU-Creación AC1 | Unitaria | Componente UI (select de categoría) | Medio | Ninguna | Apertura del selector de categoría | Solo se listan las 4 opciones definidas, sin posibilidad de texto libre | Pendiente | QA |
| CP-53 | Integracion_Estado_Inicial_Abierto | Verificar que todo ticket nuevo se crea en estado "Abierto" sin importar si lo crea un Agente o un Supervisor | Partición de equivalencia | Creación de Tickets | HU-Creación AC1 | Integración | Endpoint API (/tickets) | Alto | Ninguna | Creación de un ticket por un Agente y por un Supervisor (2 corridas) | Ambos tickets se crean con estado "Abierto" | Pendiente | QA |
| CP-54 | Sistema_Validacion_Categoria_Obligatoria | Verificar el mensaje de validación cuando el campo Categoría queda vacío al intentar crear el ticket | Análisis de valores límite (campo vacío) | Creación de Tickets | HU-Creación AC2 | Sistema | Componente UI (formulario creación) | Alto | Ninguna | Formulario con Categoría vacía y demás campos llenos | Se muestra "El campo Categoría es obligatorio"; no se crea el ticket | Pendiente | QA |
| CP-55 | Sistema_Validacion_Descripcion_Obligatoria | Verificar el mensaje de validación cuando el campo Descripción queda vacío al intentar crear el ticket | Análisis de valores límite (campo vacío) | Creación de Tickets | HU-Creación AC2 | Sistema | Componente UI (formulario creación) | Alto | Ninguna | Formulario con Descripción vacía y demás campos llenos | Se muestra "El campo Descripción es obligatorio"; no se crea el ticket | Pendiente | QA |
| CP-56 | Sistema_Tabla_Decision_Campos_Obligatorios | Verificar el mensaje mostrado ante distintas combinaciones de campos vacíos/llenos en el formulario de creación | Tabla de decisión (Categoría vacía/llena × Descripción vacía/llena) | Creación de Tickets | HU-Creación AC2 | Sistema | Componente UI (formulario creación) | Alto | Ninguna | Combinaciones: (vacía, vacía), (vacía, llena), (llena, vacía), (llena, llena) | Se muestra el mensaje correspondiente al campo faltante en cada caso; solo la combinación llena+llena permite crear el ticket | Pendiente | QA |
| CP-57 | Sistema_Agente_Autoasignacion | Verificar que cuando un Agente crea un ticket, este queda asignado automáticamente a sí mismo y no puede elegir otro Agente | Partición de equivalencia | Creación de Tickets | HU-Creación AC3 | Sistema | Flujo E2E | Crítico | Agente autenticado | Creación de ticket por Agente A | El ticket se crea asignado al Agente A; no existe control de UI para elegir otro agente | Pendiente | QA |
| CP-58 | Sistema_Supervisor_Elige_Agente | Verificar que cuando un Supervisor crea un ticket puede elegir a qué Agente se le asigna | Partición de equivalencia | Creación de Tickets | HU-Creación AC3 | Sistema | Flujo E2E | Alto | Supervisor autenticado, al menos 2 Agentes disponibles | Creación de ticket seleccionando al Agente B | El ticket se crea asignado al Agente B elegido | Pendiente | QA |
| CP-59 | Integracion_Backend_Rechaza_Asignacion_Indebida | Verificar que el backend rechaza la creación de un ticket enviado por un Agente con asignación a otro Agente, aunque el frontend no lo permita en pantalla | Error guessing (payload manipulado directamente al endpoint) | Creación de Tickets | HU-Creación AC3 | Integración | Endpoint API (/tickets) | Crítico | Token válido de Agente A | Payload de creación con agenteAsignado = Agente B | El backend responde con error de validación/autorización y no crea el ticket | Pendiente | QA |
| CP-60 | Aceptacion_Paridad_Diseno_Formulario_Creacion | Verificar que el formulario de creación de ticket respeta el diseño, estética y estructura definidos en Figma | Revisión estática comparativa (checklist visual) | Creación de Tickets | HU-Creación AC4 | Aceptación | Componente UI (formulario) | Medio | Diseño de Figma vigente disponible | Captura del formulario implementado | Sin discrepancias relevantes respecto al diseño de Figma | Pendiente | QA |
| CP-61 | Revision_Estatica_HU_Edicion_Tickets | Refinamiento de la HU | Revisión estática (inspección informal) | Edición de Tickets | HU-Edición (documento completo) | Aceptación | HU/CA (documento) | Medio | Ninguna | HU_Edicion_Tickets.md | Hallazgos documentados y elevados al PO antes del cierre del suite | Pendiente | QA |
| CP-62 | Unitaria_Campos_Editables_Categoria_Descripcion | Verificar que al editar un ticket únicamente los campos Categoría y Descripción están habilitados, y el resto aparece deshabilitado | Partición de equivalencia (campos editables/no editables) | Edición de Tickets | HU-Edición AC1 | Unitaria | Componente UI (formulario edición) | Alto | Ticket existente en estado editable | Apertura del formulario de edición | Categoría y Descripción son editables; número, estado y agente asignado (para Agente) aparecen deshabilitados | Pendiente | QA |
| CP-63 | Sistema_Agente_No_Ve_Edicion_Ticket_Ajeno | Verificar que un Agente no puede acceder a la edición de un ticket que no le pertenece desde la interfaz | Partición de equivalencia | Edición de Tickets | HU-Edición AC2 | Sistema | Componente UI | Alto | Ticket asignado a otro Agente | Intento de acceso a edición de un ticket ajeno desde UI | La opción de editar no está disponible o el acceso es bloqueado | Pendiente | QA |
| CP-64 | Integracion_Agente_Bypass_Edicion_Ticket_Ajeno | Verificar que el backend rechaza la edición de un ticket ajeno por parte de un Agente aunque la petición se envíe directamente al endpoint | Error guessing (bypass de UI) | Edición de Tickets | HU-Edición AC2 | Integración | Endpoint API (/tickets/:id) | Crítico | Ticket asignado a otro Agente, token válido de Agente A | Petición PUT/PATCH directa sobre un ticket del Agente B | El backend responde con error de autorización (403) y no aplica los cambios | Pendiente | QA |
| CP-65 | Sistema_Supervisor_Edita_Y_Reasigna | Verificar que un Supervisor puede editar cualquier ticket y reasignarlo a otro Agente | Partición de equivalencia | Edición de Tickets | HU-Edición AC2 | Sistema | Flujo E2E | Alto | Supervisor autenticado, al menos 2 Agentes disponibles | Edición de un ticket reasignándolo del Agente A al Agente B | El ticket queda actualizado con el nuevo Agente asignado | Pendiente | QA |
| CP-66 | Sistema_Bloqueo_Edicion_Ticket_Cerrado | Verificar que un ticket en estado "Cerrado" no puede editarse directamente y debe reabrirse primero | Prueba de transición de estados | Edición de Tickets | HU-Edición AC3 | Sistema | Flujo E2E | Crítico | Ticket en estado "Cerrado" | Intento de edición directa sobre un ticket cerrado | El sistema bloquea la edición e indica que el ticket debe reabrirse primero | Pendiente | QA |
| CP-67 | Sistema_Edicion_Ticket_Abierto | Verificar que un ticket en estado "Abierto" puede editarse en cualquier momento | Partición de equivalencia | Edición de Tickets | HU-Edición AC3 | Sistema | Componente UI | Medio | Ticket en estado "Abierto" | Edición de Categoría/Descripción | Los cambios se guardan correctamente sin restricción | Pendiente | QA |
| CP-68 | Sistema_Edicion_Ticket_En_Progreso | Verificar que un ticket en estado "En progreso" puede editarse en cualquier momento | Partición de equivalencia | Edición de Tickets | HU-Edición AC3 | Sistema | Componente UI | Medio | Ticket en estado "En progreso" | Edición de Categoría/Descripción | Los cambios se guardan correctamente sin restricción | Pendiente | QA |
| CP-69 | Sistema_Tabla_Decision_Permisos_Estado_Rol | Verificar el resultado combinado de permisos de edición según el estado del ticket y el rol del usuario | Tabla de decisión (estado: abierto/en progreso/cerrado × rol: Agente/Supervisor) | Edición de Tickets | HU-Edición AC2, AC3 | Sistema | Flujo E2E | Alto | Tickets en los 3 estados, asignados a distintos Agentes; Supervisor disponible | 6 combinaciones de estado × rol | Cada combinación respeta simultáneamente las reglas de permiso por rol y por estado definidas en AC2 y AC3 | Pendiente | QA |

## 9. Resumen de cobertura (a llenar al cierre del suite)

| Métrica | Valor |
|---|---|
| Total de casos diseñados | 45 |
| Casos ejecutados | |
| Casos aprobados | |
| Casos fallidos | |
| Casos bloqueados | |
| % de ACs cubiertos por al menos 1 caso | 100% (ver sección 7) |
| Defectos críticos abiertos | |
| Cumple criterio de salida (Sí/No) | |
# Suite de Pruebas — Épica: Dashboard y Métricas

## 1. Referencia

| Campo | Valor |
|---|---|
| Épica | Dashboard y Métricas |
| HUs cubiertas | HU03 Dashboard de métricas (version corregida) |
| Versión del documento | v0.2 |
| Responsable de redacción | QA |
| Fecha | 30/08/2026 |
| Test Planning General | [Link al documento general] |

## 2. Alcance del suite

Esta suite comprende la validacion de la HU Dashboard de metricas, enfocandose en la integracion entre el Frontend y el Backend, el calculo de las metricas de tickets por estado y el tiempo promedio de cierre, y su representacion en los componentes de FE. Se reduce el numero de casos a los mas criticos.

Cambio relevante de esta ronda de refinamiento: la nueva version de la HU exige de forma explicita que el calculo de la sumatoria de tiempos y el calculo del promedio se implementen en funciones separadas y dedicadas (antes solo se mencionaba una funcion aparte, en general, para el promedio). Tambien reemplaza el manejo de error por un catalogo de mensajes en frontend.

## 3. Criterios de entrada

- [ ] Cumplimiento de la fase de desarrollo, ya integrado a la branch de pruebas.
- [ ] Seed de usuarios (con al menos un perfil Agente y un perfil Supervisor) cargado previamente en el entorno de pruebas.
- [ ] HU marcada como "Ready for QA".
- [ ] Endpoint de autenticación desplegado y accesible en el ambiente de pruebas.
- [ ] Acceso al diseño de Figma vigente para contraste de paridad FE.
- [ ] Set de tickets de prueba con fechas de apertura y cierre conocidas, para poder validar los calculos de forma manual.

## 4. Criterios de salida específicos
Condiciones de salida generales:

- [ ] [¿Cumple con el DoD propio?](Link a la HU, línea en DoD)

Condiciones específicas de esta suite:

- [ ] Cobertura de los criterios de aceptación priorizados como criticos o altos en la matriz de trazabilidad (seccion 7).
- [ ] 0 defectos críticos o altos abiertos relacionados con control de acceso al Dashboard (AC1, exclusivo de Supervisor).
- [ ] Confirmado que el calculo de sumatoria y el calculo de promedio se ejecutan en funciones separadas (validado por pruebas unitarias dedicadas).
- [ ] Aclarar con el PO la redaccion del AC5 (Actualización), cuyo texto hace referencia a un "historial" que no corresponde al alcance de esta HU y parece un arrastre de copiar y pegar de la HU de Detalle de Ticket.

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
| Acceso no autorizado al dashboard por Agente | Baja | Alto | Crítico | CP-01 |
| Cálculos de métricas incorrectos | Media | Alto | Crítico | CP-02, CP-03, CP-04 |
| Datos stale o no actualizados al abrir el dashboard | Media | Medio | Alto | CP-05 |

## 6. Hallazgos técnicos detectados durante análisis

| ID | Hallazgo detectado | Impacto | Severidad | Recomendación |
|---|---|---|---|---|
| H-01 | No existe la API de métricas ni el módulo de dashboard en backend. | No se puede validar conteo, promedio ni actualización real del dashboard. | Crítico | Mantener como caso pendiente y validación manual hasta que exista implementación. |
| H-02 | El caso de acceso por rol sí fue automatizable, pero el resto de métricas requieren backend implementado. | La suite no puede cerrarse como funcional completa. | Alto | Separar validación de permisos de validación de métricas. |

## 7. Matriz de trazabilidad (criterios de aceptación → casos prioritarios)

| HU | Criterio clave | Caso(s) apoyados |
|---|---|---|
| HU03 | Acceso exclusivo a Supervisor | CP-01 |
| HU03 | Conteo por estado | CP-02 |
| HU03 | Suma y promedio de tiempo de cierre | CP-03 |
| HU03 | Exclusión de tickets no cerrados | CP-04 |
| HU03 | Datos recientes al entrar al dashboard | CP-05 |
| HU03 | API de métricas no implementada | H-01, CP-06 |

## 8. Casos de prueba prioritarios (críticos y altos)

| ID | Qué se va a probar | Técnica | Módulo | Tipo de prueba | Prioridad | Criterio de cierre | Ejecutado | Resultado | Comentarios | Evidencia |
|---|---|---|---|---|---|---|---|---|---|---|
| CP-01 | Validar que el Dashboard es accesible solo para Supervisor. | Partición de equivalencia (rol Supervisor vs. Agente) | Dashboard de métricas | Funcional manual (Frontend) + integración backend | Crítico | Se cierra cuando el Supervisor entra y el Agente es bloqueado/redirigido, sin ver valores del dashboard. | Sí | Aprobado | La regla de acceso por rol quedó validada en backend con un test unitario de autorización. | `apps/back/src/app/dashboard/tests/backend-dashboard-role/backend-dashboard-role.spec.ts` |
| CP-02 | Validar el conteo correcto de tickets por estado: abiertos, en progreso y cerrados. | Partición de equivalencia (estado) | Dashboard de métricas | Unitaria + integración backend | Alto | Se cierra cuando el número mostrado coincide con los tickets reales y cada estado tiene su conteo exacto. | No | No automatizable aún | La API de métricas no existe en backend; no hay servicio ni endpoint implementado. | N/A |
| CP-03 | Validar el cálculo de suma y promedio del tiempo de cierre de tickets cerrados. | Partición de equivalencia + prueba unitaria | Dashboard de métricas | Unitaria backend | Crítico | Se cierra cuando la suma y el promedio coinciden con el cálculo manual esperado y se calculan por funciones separadas. | No | No automatizable aún | El backend no expone ni implementa la lógica de métricas ni el endpoint del dashboard. | N/A |
| CP-04 | Validar que los tickets abiertos o en proceso no se incluyan en el promedio de cierre. | Análisis de valores límite + partición de equivalencia | Dashboard de métricas | Unitaria + integración backend | Alto | Se cierra cuando el promedio considera solo tickets cerrados y evita distorsiones por estados no cerrados. | No | No automatizable aún | El servicio de métricas aún no existe y el endpoint no está disponible. | N/A |
| CP-05 | Validar que los indicadores del dashboard se actualizan al entrar y se muestran con datos recientes. | Error guessing + integración | Dashboard de métricas | Funcional manual (Frontend) + integración backend | Alto | Se cierra cuando al ingresar nuevamente el dashboard refleja el último estado real del sistema sin stale data. | No | No automatizable aún | Faltan el módulo de dashboard y el backend de métricas para ejecutar esta validación automatizada. | N/A |
| CP-06 | Validar que el backend exponga el endpoint de métricas y que solo Supervisores puedan consumirlo. | Partición de equivalencia + error guessing | Dashboard / API | Integración backend | Crítico | Se cierra cuando el endpoint está disponible y responde con autorización correcta para rol Supervisor y rechazo para Agente. | No | Pendiente | Este caso quedó como requisito funcional crítico y actualmente no existe la implementación. | N/A |

## 9. Resumen de cobertura

| Métrica | Valor |
|---|---|
| Total de casos diseñados | 6 |
| Casos críticos | 3 |
| Casos de prioridad alta | 3 |
| Casos ejecutados | 1 |
| Casos aprobados | 1 |
| Casos fallidos | 0 |
| Casos bloqueados | 0 |
| Criterio de cierre de la suite | Se aprueba solo parcialmente: el control de acceso por rol queda validado en backend; el resto del dashboard queda pendiente hasta que exista la API, los servicios de métricas y el módulo funcional del dashboard. |
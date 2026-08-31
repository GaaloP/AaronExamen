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
| La informacion mostrada no se encuentra actualizada al momento de ingresar a la seccion | Baja | Alto | Alto | CP-41 (integracion), analisis del contrato de integracion |
| Calculos erroneos de promedios o sumatorias | Media | Alto | Crítico | CP-38, CP-39 (pruebas unitarias dedicadas a cada funcion) |
| AC5 redactado de forma ambigua puede llevar a implementar una funcionalidad que no aplica al Dashboard | Media | Medio | Alto | CP-35 (revision estatica) y aclaracion con el PO |
| Un Agente accede al Dashboard directamente por URL | Baja | Alto | Alto | CP-36 |

## 7. Matriz de trazabilidad (Criterios de Aceptación → Casos de prueba)

| HU | Criterio de Aceptación | Caso(s) de prueba relacionados |
|---|---|---|
| HU03 Dashboard de métricas | AC1 - Acceso exclusivo Supervisor | CP-36 |
| HU03 Dashboard de métricas | AC2 - Conteo de tickets por estado | CP-37 |
| HU03 Dashboard de métricas | AC3 - Tiempo promedio (funciones separadas de suma y promedio) | CP-38, CP-39 |
| HU03 Dashboard de métricas | AC4 - Tickets no cerrados excluidos del promedio | CP-40 |
| HU03 Dashboard de métricas | AC5 - Actualización | CP-41 |
| HU03 Dashboard de métricas | AC6 - Catálogo de errores | CP-42 |
| Sistema | Paridad de diseño / regresión | CP-43 |
| Sistema | No funcional | CP-44 |
| HU (documento) | Revisión de especificación / ambigüedades | CP-35 |

## 8. Casos de prueba

Se optimizo la tabla de casos fusionando "Precondiciones" y "Datos de entrada" en una sola columna, y se elimino la columna "Producto probado (ciclo de vida)" por ser redundante con el Modulo y el Tipo de prueba.

| ID | Caso de prueba | Técnica | Módulo | Criterio (HU-AC) | Tipo de prueba | Prioridad | Precondiciones y datos de entrada | Resultado esperado | Estado |
|---|---|---|---|---|---|---|---|---|---|
| CP-35 | Revision_Estatica_HU03_Dashboard_Metricas: revisar la version corregida de la HU buscando ambiguedades, en especial la redaccion del AC5 | Revisión estática | Dashboard de métricas | HU03 (documento completo) | Aceptación | Medio | Ninguna / Corrección_HU03_Dashboard_de_métricas.md | Hallazgos documentados y elevados al PO, incluyendo la aclaracion del AC5 | Pendiente |
| CP-36 | Sistema_Acceso_Exclusivo_Supervisor: validar que el Dashboard es accesible unicamente por el rol Supervisor, incluso si un Agente intenta acceder por URL directa | Partición de equivalencia | Dashboard de métricas | HU03 AC1 | Funcional (Sistema) | Crítico | Cuenta Agente y cuenta Supervisor cargadas / URL directa al Dashboard con sesion de Agente | El Dashboard solo se muestra al Supervisor; el Agente es bloqueado o redirigido | Pendiente |
| CP-37 | Unitaria_Funcion_Conteo_Por_Estado: verificar que la funcion de conteo calcula de forma precisa la cantidad de tickets por estado | Partición de equivalencia | Dashboard de métricas | HU03 AC2 | Unitaria | Alto | Al menos 5 tickets en cada uno de los 3 estados / lista de tickets como entrada | La funcion devuelve el conteo correcto por cada estado, en un objeto o arreglo | Pendiente |
| CP-38 | Unitaria_Funcion_Suma_Tiempos_Cierre: verificar que la funcion dedicada a la sumatoria de tiempos de cierre calcula el total correctamente y de forma independiente a la funcion de promedio | Partición de equivalencia | Dashboard de métricas | HU03 AC3 | Unitaria | Alto | Al menos 10 tickets cerrados con fecha de apertura y cierre conocidas | La sumatoria total de tiempos coincide con el calculo manual esperado | Pendiente |
| CP-39 | Unitaria_Funcion_Promedio_Tiempo_Cierre: verificar que la funcion dedicada al promedio calcula correctamente el tiempo promedio de cierre a partir del resultado de la funcion de sumatoria | Partición de equivalencia | Dashboard de métricas | HU03 AC3 | Unitaria | Alto | Al menos 10 tickets cerrados con fechas conocidas | El tiempo promedio calculado coincide con el esperado y se obtiene mediante una funcion separada de la sumatoria | Pendiente |
| CP-40 | Sistema_Tickets_No_Cerrados_Excluidos: verificar que los tickets en estado abierto o en proceso no se incluyen en el calculo del promedio de cierre | Análisis de valores límite | Dashboard de métricas | HU03 AC4 | Funcional (Sistema) | Alto | Mezcla de tickets cerrados y no cerrados cargados | El promedio mostrado solo considera los tickets cerrados, sin importar cuantos tickets abiertos o en proceso existan | Pendiente |
| CP-41 | Integracion_Actualizacion_Metricas_Al_Ingresar: verificar que cada vez que se ingresa a la seccion se realiza una peticion al backend para obtener los calculos actualizados | Error guessing | Dashboard de métricas | HU03 AC5 | Integración | Alto | Contrato de integracion y endpoint disponibles / se crea un ticket nuevo y se reingresa a la pantalla | Los calculos mostrados reflejan los datos mas recientes de la base de datos, incluido el ticket nuevo | Pendiente |
| CP-42 | Sistema_Catalogo_Errores_Dashboard: verificar que ante una falla al consultar la API de metricas se muestra el mensaje correspondiente segun el catalogo de errores del frontend | Error guessing (desconexion de red simulada) | Dashboard de métricas | HU03 AC6 | Funcional (Sistema) | Medio | Endpoint de metricas desconectado | Se muestra el mensaje de error correspondiente del catalogo | Pendiente |
| CP-43 | Aceptacion_Paridad_Diseno_Dashboard: validar que el componente y las metricas calculadas mantienen el diseño del Figma vigente | Revisión estática comparativa | Dashboard de métricas | HU03 AC2, AC3, AC4 | Aceptación | Medio | Implementacion del FE integrada con backend / captura de la pantalla implementada | Sin discrepancias relevantes respecto al diseño de Figma | Pendiente |
| CP-44 | NoFuncional_Rendimiento_Calculo_Metricas: medir el tiempo de respuesta del calculo de metricas con un volumen alto de tickets | Prueba no funcional de rendimiento | Dashboard de métricas | HU03 (general) | No funcional (rendimiento) | Medio | Backend con al menos 300 tickets cargados en distintos estados | El Dashboard muestra los calculos en menos de 2 segundos | Pendiente |

## 9. Resumen de cobertura (a llenar al cierre del suite)

| Métrica | Valor |
|---|---|
| Total de casos diseñados | 10 |
| Casos ejecutados | |
| Casos aprobados | |
| Casos fallidos | |
| Casos bloqueados | |
| % de ACs criticos cubiertos por al menos 1 caso |  |
| Defectos críticos abiertos | |
| Cumple criterio de salida (Sí/No) | |
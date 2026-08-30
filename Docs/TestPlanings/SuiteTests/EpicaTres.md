# Suite de Pruebas — Épica: Dashboard y Métricas
## 1. Referencia

| Campo | Valor |
|---|---|
| Épica | Dashboard y Métricas |
| HUs cubiertas | HU72 Dashboard de métricas |
| Versión del documento | v0.1 |
| Responsable de redacción | QA |
| Fecha | 29/08/2716 |
| Test Planning General | [Link al documento general] |

## 2. Alcance del suite

Esta suite de pruebas comprende la validacion de la HU DAshboard de metricas, validando esencialmente la integracion directa entre el Frontend y el Backend, en especial el calculo de las metricas generales de tickets por estado asi como su representacion en componentes FE

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

- [ ] 100% de los criterios de aceptación de ambas HUs cubiertos por al menos un caso de prueba (ver matriz de trazabilidad, sección 7).
- [ ] 0 defectos críticos o altos abiertos relacionados con control de acceso por rol (AC2 de HU Protección de Rutas).
- [ ] Validación confirmada tanto a nivel de FE como a nivel de API de que un Agente no puede acceder a vistas/endpoints de Supervisor.
- [ ] 

## 5. Técnicas de prueba aplicadas en este suite

Lista de las técnicas de diseño de casos usadas:

- Partición de equivalencia
- Análisis de valores límite
- Tabla de decisión
- Prueba de transición de estados
- Error guessing (basada en experiencia)
- Revisión / prueba estática (si aplica a HUs o CA ambiguos)

## 6. Riesgos específicos de la épica

| Riesgo | Probabilidad | Impacto | Prioridad resultante | Mitigación |
|---|---|---|---|---|
| La informacion mostrada no se encuentra actualizada | Baja | Alto | Alto | Casos de integracion y analisis del contrato de integracion |
| Calculos erroneos de promedios | Media | Alto | Critico | Pruebas unitarias para las funciones de calculo de metricas |

## 7. Matriz de trazabilidad (Criterios de Aceptación → Casos de prueba)

| HU | Criterio de Aceptación | Caso(s) de prueba relacionados |
|---|---|---|
| HU72 Dashboard de métricas | AC1 - Acceso | CP-70, CP-71 |
| HU72 Dashboard de métricas | AC2 - Conteo de tickets | CP-70, CP-72, CP-77  |
| HU72 Dashboard de métricas | AC3 - Tiempo promedio | CP-70, CP-73, CP-77  |
| HU72 Dashboard de métricas | AC4 - Tickets no cerrados | CP-70, CP-73 |
| HU72 Dashboard de métricas | AC5 - Actualización | CP-70, CP-74 |
| HU72 Dashboard de métricas | AC6 - Error | CP-70, CP-75|
| Sistema | Regresion e integracion con el sisitema | CP-70,CP-76, CP-77  |

## 8. Casos de prueba

| ID | Caso de prueba | Descripción | Técnica de prueba | Sección / Módulo | Criterio relacionado (HU-AC) | Tipo de prueba | Producto probado (ciclo de vida) | Prioridad | Precondiciones | Datos de entrada | Resultado esperado | Estado | Responsable |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CP-70 | Revision_Estatica_HU72_Dashboard_de_metricas | Revisar la especificación de HU70 buscando ambigüedades | Revisión estática (inspección informal) | Dashboard de metricas | HU72 (documento completo) | Aceptación | HU/CA (documento) | Medio | Ninguna | HU72 dashboard de metricas | Hallazgos documentados y corregidos en la HU | Pendiente | QA |
| CP-71 | Sistema_modulo_visible_supervisor | Validar que este apartado sea accesible unicamente para usuarios de tipo supervisores, aun y cuando agentes intentan acceder por medio de la ruta. | Particion de equivalencia | Dashboard Metricas | HU71 AC1 | Sistema | Componente UI | Critico | Cuenta como supervisor y cuenta como agente cargada en DB| Ninguno | Pantalla unicamente disponible para supervisores | Pendiente | Todo el equipo |
| CP-72 | Unitaria_funcion_conteo | Sistema debe calcular de manera presisa el  conteo de tickets en cada estado | Particion de equivalencias | Funcion para sumatorias | AC2 | Sistema | funcion en backend | alta | almenos 5 tikets en cada uno de los estados posibles | Lista de tickets | Sumatoria acertada de tickets presentes para cada estado, almacenadas en un array u objeto | pendiente | DEV |
| CP-73 | Unitaria_funcion_tiempo_promedio | Sistema debe de calcular de manera presisa el promedio general del tiempo en el que se cierra un ticket | Particion de equivalencias | Funcion promedio de tiempo | CA3 | Sistema | funcion de backend | alta | Al menos 10 tickets cerrados | Objeto con fechas de inicio y fin para cada los tickets cerrados | Tiempo promedio en el que tarda en cerrarce un ticket con formato date | Pendiente | DEV |
| CP-74 | Integracion_Datos_actualizados | Cada que se ingrese a esta seccion se debe de hacer una peticion al backend para obtener los calculos con los ultimos datos | Error guessing | Dashboard Metricas | CA5 | Integracion | Llama a API | alta | Contrato de integracion, endpoint y FE generados | Respuesta de la API al realizar la consulta | Calculos actualizados con respecto a los tickets recidentes en la DB | Pendiente | QA |
| CP-75 | Sistema_Error_al_consultar_metricas | Al no poderse consultar la API se muestra un mensaje de error | Manual de confirmacion | Dashboard metricas | CA6 | Sistema | Consulta a la API | media | Endpoint de metricas integrado con el FE, desconexion de la red al ingresar al componente | ninguno | Mensaje de error al cargar los datos (ver AC6) | Pendiente | QA |
| CP-76 | Sistema_Seccion_Metricas_visible_solo_para_supervisores | En el menu de navegacion la seccion de metricas solo debe de ser visible por los supervisores | Particion de equivalencias | Dashboard principal | HU Dashboard de metricas | Sistema/confirmacion | Modulos generales | media | Dashboard principal desarrollado | ninguno | Seccion metricas visible en le menu unicamente para supervisores | Pendiente | QA |
| CP-77 | Aceptacion_Paridad_disenio_producto | Validar explicitamente que el componente y las metricas calculadas mantienen el disenio del figma | Manual de confirmacion | Dashboard metricas | AC2, AC3, AC4 | Sistema | UI | media | Implementacion directa del FE e integracion con el backend | ninguno | Paridad entre Figma y producto | Pendiente | QA |

## 9. Resumen de cobertura (a llenar al cierre del suite)

| Métrica | Valor |
|---|---|
| Total de casos diseñados | |
| Casos ejecutados | |
| Casos aprobados | |
| Casos fallidos | |
| Casos bloqueados | |
| % de ACs cubiertos por al menos 1 caso | |
| Defectos críticos abiertos | |
| Cumple criterio de salida (Sí/No) | |
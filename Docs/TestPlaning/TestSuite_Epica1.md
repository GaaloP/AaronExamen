# Suite de Pruebas — Épica: Autenticación y Seguridad

## 1. Referencia

| Campo | Valor |
|---|---|
| Épica | Autenticación y Seguridad |
| HUs cubiertas | HU Login, HU Protección de Rutas |
| Versión del documento | v1.3 |
| Responsable de redacción | QA |
| Fecha | 30/08/2026 |
| Test Planning General | [Link al documento general]() |

## 2. Alcance del suite

Esta suite de pruebas comprende las HUs Login y Protección de Rutas, validando el cumplimiento de los criterios de aceptación, la integración entre frontend y backend (endpoint de autenticación, guardas de ruteo, control de acceso por rol) y la paridad entre el diseño en Figma y el producto implementado. Esta version del suite prioriza los casos criticos y de mas alto riesgo.

Queda fuera de este alcance: pruebas de accesibilidad, compatibilidad cross-browser/cross-device y estudios de satisfacción del cliente. Se incluyen, de forma acotada, un par de validaciones no funcionales (rendimiento y seguridad basica) solicitadas para esta ronda.

## 3. Criterios de entrada

- [ ] Cumplimiento de la fase de desarrollo, ya integrado a la branch de pruebas.
- [ ] Seed de usuarios (con al menos un perfil Agente y un perfil Supervisor) cargado previamente en el entorno de pruebas.
- [ ] HUs marcadas como "Ready for QA".
- [ ] Endpoint de autenticación desplegado y accesible en el ambiente de pruebas.
- [ ] Acceso al diseño de Figma vigente para contraste de paridad FE.

## 4. Criterios de salida específicos

Condiciones de salida generales:

- [ ] ¿Las HUs cumplen con el DoD propio?

Condiciones específicas de esta suite:

- [ ] Cobertura de los criterios de aceptación priorizados como críticos o altos en la matriz de trazabilidad.
- [ ] 0 defectos críticos o altos abiertos relacionados con control de acceso por rol (AC2 de HU Protección de Rutas).
- [ ] Refinamiento pendiente de la HU Login: aclarar con el PO la duplicidad de numeración de "AC4" (Campo contraseña / Diseño FE / Redirección a dashboard) antes del cierre del suite.
- [ ] Mensajes de validación y error verificados textualmente contra lo especificado en los AC.
- [ ] Confirmar con el PO la regla de negocio para cuando un Supervisor intenta acceder a una vista exclusiva de Agente (no esta definida en la HU actual).

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
| Fuga de datos/acceso indebido entre roles Agente/Supervisor mediante URL directa | Media | Alto | Crítico | Casos dedicados de control de acceso a nivel FE y API (CP-10, CP-11) |
| Ambiguedad en numeracion de AC de HU Login puede provocar que algunos criterios no se prueben por confusion | Media | Medio | Alto | Revision estatica (CP-01) y aclaracion formal con el PO antes de iniciar ejecucion |

## 7. Matriz de trazabilidad (Criterios de Aceptación → Casos de prueba)

| HU | Criterio de Aceptación | Caso(s) de prueba relacionados |
|---|---|---|
| HU-Login | AC1 — Carga de perfiles desde seed | Verificado como precondición implícita en CP-03, CP-04|
| HU-Login | AC2 — Validación de credenciales e inicio de sesión | CP-03, CP-04, CP-05, CP-07 |
| HU-Login | AC3 — Campo correo | CP-07, CP-08 |
| HU-Login | AC4 (Campo contraseña) | CP-07, CP-08 |
| HU-Login | AC5 (Redirección a dashboard) | CP-09 |
| HU-Protección de Rutas | AC1 — Redirección a login | CP-10 |
| HU-Protección de Rutas | AC2 — Bloqueo de accesos según rol | CP-10, CP-11 |
| Ambas HUs | Revisión de especificación / ambigüedades | CP-01, CP-02 |
| Ambas HUs | No funcional | CP-12, CP-13 |

## 8. Casos de prueba

Se optimizo la tabla de casos fusionando las columnas de "Precondiciones" y "Datos de entrada" en una sola, y se elimino la columna "Producto probado (ciclo de vida)" por ser redundante con el Modulo y el Tipo de prueba.

| ID | Caso de prueba | Técnica | Módulo | Criterio (HU-AC) | Tipo de prueba | Prioridad | Precondiciones y datos de entrada | Resultado esperado | Estado |
|---|---|---|---|---|---|---|---|---|---|
| CP-01 | Revision_Estatica_HU_Login: revisar la especificacion de la HU buscando ambiguedades y vacios de definicion | Revisión estática | Login | HU-Login (documento completo) | Aceptación | Medio | Ninguna / HU_Login.md | Hallazgos documentados y elevados al PO antes del cierre del suite | Pendiente |
| CP-02 | Revision_Estatica_HU_Proteccion_Rutas: revisar la especificacion identificando vacios (ej. comportamiento de Supervisor sobre vistas de Agente) | Revisión estática | Protección de Rutas | HU-Protección de Rutas (documento completo) | Aceptación | Medio | Ninguna / HU_Proteccion_Rutas.md | Hallazgos documentados y elevados al PO antes del cierre del suite | Pendiente |
| CP-03 | Sistema_Login_Exitoso_Por_Rol: verificar que un usuario Agente y un usuario Supervisor con credenciales validas pueden iniciar sesion exitosamente | Tabla de decisión (rol Agente / rol Supervisor) | Login | HU-Login AC2 | Funcional (Sistema) | Crítico | Usuarios Agente y Supervisor en seed / correo y contraseña validos para cada uno | Login exitoso para ambos roles, sesion iniciada, sin mensajes de error | Pendiente |
| CP-04 | Sistema_Login_Credenciales_Incorrectas: verificar que con credenciales incorrectas se muestra la notificacion exacta y no se otorga acceso | Partición de equivalencia (clase inválida) | Login | HU-Login AC2 | Funcional (Sistema) | Crítico | Usuario existente en seed / correo valido con contraseña incorrecta | Se muestra "El usuario o contraseña es incorrecto, intente de nuevo"; no se inicia sesión | Pendiente |
| CP-05 | Integracion_Endpoint_Autenticacion: verificar la respuesta del endpoint de autenticacion con credenciales validas e invalidas (2 corridas) | Prueba de integración de componentes | Login | HU-Login AC2 | Integración | Crítico | Endpoint desplegado / payload valido y payload invalido | Con credenciales validas responde 200 con token y rol; con invalidas responde error (4xx) sin exponer info sensible | Pendiente |
| CP-06 | Unitaria_Persistencia_Sesion_Redux: verificar que tras un login exitoso el estado de sesion se guarda correctamente en el store global | Prueba de transición de estados | Login | HU-Login AC2 | Unitaria | Alto | Store Redux en estado "no autenticado" / accion de login exitosa despachada | El store refleja estado "autenticado" con usuario y rol persistidos | Pendiente |
| CP-07 | Sistema_Tabla_Decision_Campos_Obligatorios: verificar el comportamiento del formulario con correo y/o contraseña vacios | Tabla de decisión (correo vacío/válido × contraseña vacía/válida) | Login | HU-Login AC3, AC4 | Funcional (Sistema) | Alto | Ninguna / combinaciones (vacío,vacío), (vacío,válida), (válido,vacía), (válido,válida) | Cada combinacion muestra la validacion correspondiente al campo faltante; solo válido+válido permite continuar | Pendiente |
| CP-08 | Unitaria_Formato_Correo_Y_Longitud_Contrasena: verificar formato invalido de correo y limite minimo de 8 caracteres en contraseña | Análisis de valores límite + partición de equivalencia | Login | HU-Login AC3, AC4 | Unitaria | Alto | Ninguna / correos "usuario", "usuario@", "usuario@dominio" y contraseñas de 7 y 8 caracteres | Formatos de correo invalidos son rechazados; contraseña de 7 caracteres invalida, de 8 aceptada | Pendiente |
| CP-09 | Sistema_Redireccion_Dashboard_Por_Rol: verificar que tras login exitoso el usuario es redirigido a su dashboard correspondiente | Tabla de decisión (credenciales válidas × rol → destino) | Login | HU-Login AC5 (redirección) | Funcional (Sistema) | Crítico | Usuario valido en seed / credenciales validas de Agente y Supervisor | El usuario es redirigido al dashboard correspondiente inmediatamente despues del login | Pendiente |
| CP-10 | Sistema_Bloqueo_Cruzado_Por_Rol: verificar bloqueo cuando un Agente intenta acceder a vista de Supervisor por URL directa, y viceversa | Error guessing + partición de equivalencia | Protección de Rutas | HU-Protección de Rutas AC1, AC2 | Funcional (Sistema) | Crítico | Usuario Agente y Supervisor autenticados / URL directa a ruta exclusiva del otro rol | Acceso bloqueado en ambos sentidos, redireccion o pantalla de acceso denegado | Pendiente |
| CP-11 | Integracion_Validacion_Rol_Backend: verificar que el control de acceso por rol tambien se aplica en el backend y no solo en el guard de FE | Error guessing (bypass de FE) | Protección de Rutas | HU-Protección de Rutas AC2 | Integración | Crítico | Token valido de Agente | Petición directa a un endpoint exclusivo de Supervisor | El backend responde 403 sin exponer datos de Supervisor | Pendiente |
| CP-12 | NoFuncional_Tiempo_Respuesta_Login: medir el tiempo de respuesta del flujo de login end to end | Prueba no funcional de rendimiento | Login | HU-Login AC2 | No funcional (rendimiento) | Medio | Ambiente de pruebas estable / 10 intentos de login validos | El login responde en menos de 2 segundos en al menos el 90% de los intentos | Pendiente |
| CP-13 | NoFuncional_Seguridad_Datos_Sensibles: verificar que la contraseña no se expone en la respuesta del API ni en logs, y que el mensaje de error no revela si el correo existe o no | Error guessing | Login | HU-Login AC2 | No funcional (seguridad) | Alto | Endpoint desplegado / peticiones con correo existente e inexistente | La respuesta y los logs no contienen la contraseña en texto plano; el mensaje de error es identico para correo inexistente y contraseña incorrecta | Pendiente |

## 9. Resumen de cobertura (a llenar al cierre del suite)

| Métrica | Valor |
|---|---|
| Total de casos diseñados | 13 |
| Casos ejecutados | |
| Casos aprobados | |
| Casos fallidos | |
| Casos bloqueados | |
| % de ACs criticos cubiertos por al menos 1 caso | |
| Defectos críticos abiertos | |
| Cumple criterio de salida (Sí/No) | |
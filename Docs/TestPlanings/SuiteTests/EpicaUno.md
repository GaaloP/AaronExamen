# suite de Pruebas — Épica: Autenticación y Seguridad

## 1. Referencia

| Campo | Valor |
|---|---|
| Épica | Autenticación y Seguridad |
| HUs cubiertas | HU Login, HU Protección de Rutas |
| Versión del documento | v0.2 |
| Responsable de redacción | QA |
| Fecha | 29/08/2026 |
| Test Planning General | [Link al documento general]() |

## 2. Alcance del suite

Esta suite de pruebas comprende las HUs Login y Protección de Rutas, no solo contemplando el correcto cumplimiento de los criterios de aceptación, sino también validando la integración entre frontend y backend (endpoint de autenticación, guardas de ruteo, control de acceso por rol) y la paridad entre el diseño en Figma y el producto implementado. Queda fuera de este alcance: pruebas no funcionales de rendimiento/carga, pruebas de accesibilidad, pruebas de compatibilidad cross-browser/cross-device y estudios de satisfacción del cliente.

## 3. Criterios de entrada

Antes de comenzar a testear es necesario cumplir con los sigFEentes criterios:

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
- [ ] Ambigüedad de numeración duplicada de "AC4" en HU Login (Campo contraseña / Diseño FE / Redirección a dashboard) aclarada y documentada con el PO antes del cierre del suite.
- [ ] Mensajes de validación y error verificados textualmente contra lo especificado en los AC.

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
| Fuga de datos/acceso indebido entre roles Agente/Supervisor mediante URL directa | Media | Alto | Crítico | Casos dedicados de control de acceso a nivel FE y API (CP-20, CP-21, CP-23) |
| Bypass de validaciones de frontend llamando directamente al endpoint de autenticación o a endpoints protegidos sin pasar por la FE | Media | Alto | Alto | Pruebas de integración a nivel de API, no solo de FE (CP-06, CP-08, CP-23) |
| Ambigüedad en la HU Login por numeración duplicada de "AC4" (contraseña, diseño FE, redirección) genera cobertura incompleta o interpretación distinta entre Dev y QA | Alta | Medio | Alto | Revisión estática temprana de la HU (CP-01) y clarificación formal con el PO |
| Mensajes de error/validación no coinciden textualmente con lo especificado, afectando la aceptación del negocio | Media | Bajo | Medio | Casos de validación exacta de copy en mensajes (CP-09, CP-12, CP-05) |
| Estado de sesión en Redux desincronizado del backend (p. ej. token expirado pero estado global sigue "autenticado"), permitiendo navegación indebida | Media | Alto | Alto | Caso de transición de estados de sesión end-to-end (CP-07, CP-22) |
| HU Protección de Rutas no especifica comportamiento para roles adicionales o expiración de sesión, dejando vacíos de cobertura | Media | Medio | Medio | Revisión estática de la HU (CP-24) y solicitud de aclaración al PO |

## 7. Matriz de trazabilidad (Criterios de Aceptación → Casos de prueba)

| HU | Criterio de Aceptación | Caso(s) de prueba relacionados |
|---|---|---|
| HU-Login | AC1 — Carga de perfiles desde seed | CP-01, CP-02 |
| HU-Login | AC2 — Validación de credenciales e inicio de sesión | CP-03, CP-04, CP-05, CP-06, CP-07, CP-08, CP-17 |
| HU-Login | AC3 — Campo correo | CP-09, CP-10, CP-11, CP-17 |
| HU-Login | AC4 (Campo contraseña) | CP-12, CP-13, CP-14, CP-17 |
| HU-Login | AC4 (Diseño FE) | CP-15 |
| HU-Login | AC4 (Redirección a dashboard) | CP-16 |
| HU-Protección de Rutas | AC1 — Redirección a login | CP-18, CP-22 |
| HU-Protección de Rutas | AC2 — Bloqueo de accesos según rol | CP-19, CP-20, CP-21, CP-23 |
| Ambas HUs | Revisión de especificación / ambigüedades | CP-01, CP-24 |

## 8. Casos de prueba

| ID | Caso de prueba | Descripción | Técnica de prueba | Sección / Módulo | Criterio relacionado (HU-AC) | Tipo de prueba (nivel) | Producto probado (ciclo de vida) | Prioridad | Precondiciones | Datos de entrada | Resultado esperado | Estado | Responsable |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CP-01 | Revision_Estatica_HU_Login | Refinamiento de la HU | Revisión estática (inspección informal / checklist) | Login | HU-Login (documento completo) | Aceptación | HU/CA (documento) | Medio | Ninguna | HU_Login.md | Completar el DoR  | Pendiente | BA, QA, DEV, SM |
| CP-02 | Integracion_Seed_Usuarios | Verificar que los usuarios (Agente y Supervisor) definidos en la seed se cargan correctamente en la base de datos del ambiente de pruebas y son consultables por el endpoint de autenticación | Partición de equivalencia (perfil Agente / perfil Supervisor) | Login | HU-Login AC1 | Integración | Job de base de datos (script de seed) | Alto | Ambiente de pruebas limpio, script de seed disponible | Seed con 3 usuarios Agente y 1 usuario Supervisor | Todos los usuarios quedan persistidos en BD con rol correcto y son autenticables | Pendiente | QA |
| CP-03 | Sistema_Login_Exitoso_Agente | Verificar que un usuario con rol Agente y credenciales válidas puede iniciar sesión exitosamente | Partición de equivalencia (clase válida) | Login | HU-Login AC2 | Sistema | Flujo E2E (FE + API) | Crítico | Usuario Agente cargado desde seed | correo: agente.valido@dominio.com / contraseña: Valida123 | Login exitoso, sesión iniciada, sin mensajes de error | Pendiente | QA |
| CP-04 | Sistema_Login_Exitoso_Supervisor | Verificar que un usuario con rol Supervisor y credenciales válidas puede iniciar sesión exitosamente | Partición de equivalencia (clase válida) | Login | HU-Login AC2 | Sistema | Flujo E2E (FE + API) | Crítico | Usuario Supervisor cargado desde seed | correo: supervisor.valido@dominio.com / contraseña: Valida123 | Login exitoso, sesión iniciada, sin mensajes de error | Pendiente | QA |
| CP-05 | Sistema_Login_Credenciales_Incorrectas | Verificar que al ingresar credenciales incorrectas se muestra la notificación exacta especificada y no se otorga acceso | Partición de equivalencia (clase inválida) | Login | HU-Login AC2 | Sistema | Flujo E2E (FE + API) | Crítico | Usuario existente en seed | correo: agente.valido@dominio.com / contraseña: Incorrecta1 | Se muestra notificación "El usuario o contraseña es incorrecto, intente de nuevo"; no se inicia sesión | Pendiente | QA |
| CP-06 | Integracion_Endpoint_Autenticacion_Exitoso | Verificar el consumo correcto del endpoint de autenticación desde el frontend con credenciales válidas | Prueba de integración de componentes (contrato integracon) | Login | HU-Login AC2 | Integración | Endpoint API (/auth/login) | Crítico | Endpoint desplegado, usuario válido en seed | Payload con credenciales válidas | Respuesta 200 con token/datos de sesión y rol del usuario | Pendiente | QA |
| CP-07 | Unitaria_Persistencia_Sesion_Redux | Verificar que tras un login exitoso el estado de sesión se guarda correctamente en el store global de Redux (transición de estado "no autenticado" a "autenticado") | Prueba de transición de estados | Login | HU-Login AC2 | Unitaria | Componente FE (store Redux) | Alto | Store Redux inicial en estado "no autenticado" | Acción de login exitosa despachada | El store refleja estado "autenticado" con datos de usuario y rol persistidos | Pendiente | QA |
| CP-08 | Integracion_Endpoint_Autenticacion_Fallido | Verificar la respuesta del endpoint de autenticación ante credenciales inválidas, sin depender de la validación de FE | Partición de equivalencia (clase inválida) | Login | HU-Login AC2 | Integración | Endpoint API (/auth/login) | Alto | Endpoint desplegado | Payload con credenciales inexistentes/incorrectas | Respuesta de error (4xx) sin exponer información sensible del usuario | Pendiente | QA |
| CP-09 | Sistema_Correo_Obligatorio | Verificar que al intentar iniciar sesión con el campo correo vacío se muestra la validación exacta especificada | Análisis de valores límite (campo vacío) | Login | HU-Login AC3 | Sistema | Componente FE (formulario login) | Alto | Ninguna | Correo: "" / Contraseña: cualqFEer valor válido | Se muestra "El correo es obligatorio"; no se envía la petición de login | Pendiente | QA |
| CP-10 | Unitaria_Formato_Correo_Invalido | Verificar que el campo correo rechaza formatos no válidos de correo electrónico | Partición de equivalencia (formatos válidos/inválidos) | Login | HU-Login AC3 | Unitaria | Componente FE (input correo) | Alto | Ninguna | Valores: "usuario", "usuario@", "usuario@dominio", "@dominio.com" | El campo marca el valor como inválido en todos los casos y no permite avanzar | Pendiente | QA |
| CP-11 | Unitaria_Caracteres_Bloqueados_Correo | Verificar que el campo correo bloquea la escritura de caracteres distintos a letras a-z, números 0-9, punto, gFEon y gFEon bajo | Partición de equivalencia + Error guessing | Login | HU-Login AC3 | Unitaria | Componente FE (input correo) | Medio | Ninguna | Intentar ingresar caracteres: espacio, "#", "$", "/", "ñ", emoji | Ninguno de los caracteres no permitidos se refleja en el campo | Pendiente | QA |
| CP-12 | Sistema_Contrasena_Obligatoria | Verificar que al intentar iniciar sesión con el campo contraseña vacío se muestra la validación exacta especificada | Análisis de valores límite (campo vacío) | Login | HU-Login AC4 (contraseña) | Sistema | Componente FE (formulario login) | Alto | Ninguna | Correo: valor válido / Contraseña: "" | Se muestra "La contraseña es obligatoria"; no se envía la petición de login | Pendiente | QA |
| CP-13 | Unitaria_Longitud_Minima_Contrasena | Verificar el límite de longitud mínima (8 caracteres) para considerar una contraseña válida | Análisis de valores límite (7 / 8 / 9 caracteres) | Login | HU-Login AC4 (contraseña) | Unitaria | Componente FE (input contraseña) | Alto | Ninguna | Contraseñas de 7, 8 y 9 caracteres | 7 caracteres: inválida; 8 y 9 caracteres: aceptadas por la validación de longitud | Pendiente | QA |
| CP-14 | Unitaria_Icono_Mostrar_Ocultar_Contrasena | Verificar que el ícono de ojo alterna correctamente entre mostrar y ocultar el valor del campo contraseña | Prueba de transición de estados (oculto ↔ visible) | Login | HU-Login AC4 (contraseña) | Unitaria | Componente FE (input contraseña) | Bajo | Campo contraseña con texto ingresado | Click en ícono de ojo (2 veces consecutivas) | Primer click revela el texto en claro; segundo click vuelve a ocultarlo | Pendiente | QA |
| CP-15 | Aceptacion_Paridad_Diseno_Figma | Verificar que la pantalla de login implementada respeta el orden, estructura y elementos definidos en el diseño de Figma | Revisión estática comparativa (checklist visual contra diseño) | Login | HU-Login AC4 (diseño FE) | Aceptación | Componente FE (pantalla de login) | Medio | Diseño de Figma vigente disponible | Captura de la pantalla implementada | Sin discrepancias relevantes de orden/estructura respecto al diseño de Figma | Pendiente | QA |
| CP-16 | Sistema_Redireccion_Dashboard | Verificar que tras un login exitoso el usuario es redirigido automáticamente al dashboard correspondiente | Tabla de decisión (credenciales válidas × rol → destino) | Login | HU-Login AC4 (redirección) | Sistema | Flujo E2E (FE + API) | Crítico | Usuario válido en seed | Credenciales válidas de Agente y de Supervisor (2 corridas) | El usuario es redirigido al dashboard inmediatamente después del login exitoso | Pendiente | QA |
| CP-17 | Sistema_Tabla_Decision_Formulario_Login | Verificar el comportamiento del formulario ante combinaciones de campos vacíos/llenos/inválidos (correo y contraseña) | Tabla de decisión (correo: vacío/inválido/válido × contraseña: vacía/corta/válida) | Login | HU-Login AC2, AC3, AC4 (contraseña) | Sistema | Componente FE + integración | Alto | Ninguna | Combinaciones: (vacío, vacío), (vacío, válida), (válido, vacía), (inválido, válida), (válido, corta), (válido, válida) | Cada combinación produce el mensaje/resultado correspondiente a la regla de negocio definida (solo la combinación válido+válido permite el login) | Pendiente | QA |
| CP-18 | Sistema_Redireccion_Login_No_Autenticado | Verificar que un usuario no autenticado que intenta acceder directamente a una ruta protegida (vía URL) es redirigido a la pantalla de login | Partición de equivalencia (estado de sesión: autenticado/no autenticado) | Protección de Rutas | HU-Protección de Rutas AC1 | Sistema | Módulo de ruteo (route guard) | Crítico | Sin sesión iniciada (sin token/estado en Redux) | URL directa a una ruta protegida, p. ej. /dashboard | El usuario es redirigido a la pantalla de login | Pendiente | QA |
| CP-19 | Sistema_Acceso_Ruta_Correspondiente_Rol | Verificar que un usuario autenticado accede correctamente a la(s) ruta(s) correspondientes a su propio rol | Partición de equivalencia (rol Agente / rol Supervisor) | Protección de Rutas | HU-Protección de Rutas AC2 | Sistema | Módulo de ruteo (route guard) | Alto | Usuario Agente y Usuario Supervisor autenticados (2 corridas) | Navegación a la ruta propia del rol de cada usuario | Cada usuario accede sin restricciones a la vista correspondiente a su propio rol | Pendiente | QA |
| CP-20 | Sistema_Bloqueo_Agente_A_Vista_Supervisor | Verificar que un Agente autenticado no puede acceder a una vista de Supervisor ni siqFEera escribiendo la URL directamente en el navegador | Error guessing + Partición de equivalencia | Protección de Rutas | HU-Protección de Rutas AC2 | Sistema | Módulo de ruteo (route guard) | Crítico | Usuario Agente autenticado | URL directa a una ruta exclusiva de Supervisor | Acceso bloqueado; el sistema no muestra el contenido de la vista de Supervisor (redirección o pantalla de acceso denegado) | Pendiente | QA |
| CP-21 | Sistema_Acceso_Supervisor_A_Vista_Agente | Verificar el comportamiento del sistema cuando un Supervisor autenticado intenta acceder a una vista exclusiva de Agente vía URL directa | Partición de equivalencia | Protección de Rutas | HU-Protección de Rutas AC2 | Sistema | Módulo de ruteo (route guard) | Medio | Usuario Supervisor autenticado | URL directa a una ruta exclusiva de Agente | Comportamiento conforme a la regla de negocio definida por el PO (a confirmar, ver CP-24); por defecto, se espera bloqueo salvo indicación contraria | Pendiente | QA |
| CP-22 | Sistema_Transicion_Sesion_Logout_Ruta_Protegida | Verificar el ciclo completo de transición de sesión: login exitoso → navegación autenticada → cierre/expiración de sesión → intento de acceso a ruta protegida | Prueba de transición de estados | Protección de Rutas | HU-Protección de Rutas AC1 | Sistema | Flujo E2E (sesión) | Alto | Usuario válido en seed | Login exitoso, luego logout o expiración forzada de sesión, luego URL directa a ruta protegida | Tras el cierre/expiración de sesión, el intento de acceso a ruta protegida redirige a login | Pendiente | QA |
| CP-23 | Integracion_Validacion_Rol_Backend | Verificar que el control de acceso por rol también se aplica a nivel de API/backend y no únicamente en el guard de frontend | Error guessing (bypass de FE, llamada directa al endpoint) | Protección de Rutas | HU-Protección de Rutas AC2 | Integración | Endpoint API (recursos por rol) | Crítico | Token válido de usuario Agente | Petición directa (sin pasar por FE) a un endpoint exclusivo de Supervisor | El backend responde con error de autorización (403) sin exponer datos de Supervisor | Pendiente | QA |
| CP-24 | Revision_Estatica_HU_Proteccion_Rutas | Revisar la especificación de HU Protección de Rutas identificando vacíos de definición (p. ej. comportamiento de Supervisor sobre vistas de Agente, manejo de expiración de sesión) | Revisión estática (inspección informal / checklist) | Protección de Rutas | HU-Protección de Rutas (documento completo) | Aceptación | HU/CA (documento) | Medio | Ninguna | HU_Proteccion_Rutas.md | Hallazgos documentados y elevados al PO antes del cierre del suite (p. ej. regla para CP-21) | Pendiente | QA |

## 9. Resumen de cobertura (a llenar al cierre del suite)

| Métrica | Valor |
|---|---|
| Total de casos diseñados | 24 |
| Casos ejecutados | |
| Casos aprobados | |
| Casos fallidos | |
| Casos bloqueados | |
| % de ACs cubiertos por al menos 1 caso | 100% (ver sección 7) |
| Defectos críticos abiertos | |
| Cumple criterio de salida (Sí/No) | |
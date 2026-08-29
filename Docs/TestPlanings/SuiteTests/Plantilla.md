# Suite de Pruebas — Épica: [Nombre de la épica]

> Documento derivado del **Test Planning General**. Este suite detalla los casos de prueba correspondientes a la épica indicada.

## 1. Referencia

| Campo | Valor |
|---|---|
| Épica | [Nombre] |
| HUs cubiertas | [HU-01, HU-02, ...] |
| Versión del documento | v1.0 |
| Responsable de redacción | QA |
| Fecha | [dd/mm/aaaa] |
| Test Planning General | [Link al documento general] |

## 2. Alcance del suite

Breve descripción de qué cubre este suite (qué funcionalidad de la épica) y qué queda explícitamente fuera de alcance (por ejemplo, pruebas de carga, pruebas de seguridad exhaustivas, etc., si se manejan en otro documento).

## 3. Criterios de entrada

Condiciones necesarias antes de comenzar a ejecutar este suite (ej. entorno de QA desplegado, seed de usuarios cargada, HUs marcadas como "Ready for QA", ambiente con datos de prueba disponibles).

## 4. Criterios de salida específicos

Adicional a los definidos en el Test Planning General (DoD, 90%/100% según criticidad), agregar aquí condiciones propias de la épica si aplica (ej. "0 defectos críticos abiertos relacionados a permisos por rol").

## 5. Técnicas de prueba aplicadas en este suite

Lista de las técnicas de diseño de casos usadas (según Capítulo 4 ISTQB), para que quede explícito el criterio de diseño detrás de la tabla:

- Partición de equivalencia
- Análisis de valores límite
- Tabla de decisión
- Prueba de transición de estados
- Error guessing (basada en experiencia)
- Revisión / prueba estática (si aplica a HUs o CA ambiguos)

## 6. Riesgos específicos de la épica

| Riesgo | Probabilidad | Impacto | Prioridad resultante | Mitigación |
|---|---|---|---|---|
| [ej. Fuga de datos entre roles agente/supervisor] | Alta/Media/Baja | Alto/Medio/Bajo | Crítico/Alto/Medio/Bajo | [ej. Casos de prueba dedicados a control de acceso] |

## 7. Matriz de trazabilidad (Criterios de Aceptación → Casos de prueba)

| HU | Criterio de Aceptación | Caso(s) de prueba relacionados |
|---|---|---|
| HU-01 | AC1 | CP-01, CP-02 |
| HU-01 | AC2 | CP-03 |
| ... | ... | ... |

*(Sirve para verificar que ningún AC quede sin al menos un caso de prueba asociado — cobertura de requisitos.)*

## 8. Casos de prueba

| ID | Caso de prueba | Descripción | Técnica de prueba | Sección / Módulo | Criterio relacionado (HU-AC) | Tipo de prueba | Producto probado (ciclo de vida) | Prioridad | Precondiciones | Datos de entrada | Resultado esperado | Estado | Responsable |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CP-01 | [Nombre corto y accionable] | [Qué valida el caso, en una línea] | [Partición de equivalencia / Valor límite / Tabla de decisión / Error guessing / etc.] | [ej. Login, Lista de tickets, Dashboard] | [HU-Login AC2] | [Unitaria / Integración / Sistema / Aceptación] | [Historia de usuario / API / Componente FE / Endpoint / Base de datos] | [Crítico / Alto / Medio / Bajo] | [Estado previo requerido] | [Valores concretos usados] | [Resultado exacto esperado] | [Pendiente / Pass / Fail / Bloqueado] | [QA / Dev / BA] |
| CP-02 | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

### Notas sobre las columnas

- **Técnica de prueba:** declarar la técnica formal usada para diseñar el caso (no solo "prueba manual"), esto documenta el criterio de cobertura detrás de cada fila, tal como se revisó en los escenarios prácticos del examen de QA.
- **Tipo de prueba (nivel):** usar los niveles del syllabus — Unitaria (componente), Integración (interacción entre componentes/endpoints), Sistema (end-to-end), Aceptación (validación de negocio) — no tipos de prueba (regresión, rendimiento, etc.), esos pueden ir en una columna adicional de "Tipo adicional" si se requiere.
- **Producto probado (ciclo de vida):** el work product que se está ejerciendo directamente — una HU/CA (prueba estática), un endpoint/API, un componente de UI, un job de base de datos, etc. Ayuda a distinguir si el defecto encontrado es de especificación, de FE, de BE o de integración.
- **Prioridad:** Crítico (bloquea el flujo principal o compromete seguridad/datos), Alto, Medio, Bajo — debe ser consistente con la técnica de priorización definida en el Test Planning General (requisitos > cobertura > riesgo).
- **Estado:** se actualiza durante la ejecución, no en el diseño inicial.

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
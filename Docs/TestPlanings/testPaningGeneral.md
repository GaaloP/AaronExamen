# Test Planning General
Creador: Carlos
Version: v0.1
Fecha: 29/08/2026

## Contexto

El presente documento muestra la planeación general de las pruebas que serán aplicadas a todo el sistema. El alcance general del documento reside en la segmentación y especificación de las pruebas a realizar; sin embargo, no se presentarán directamente los suites de pruebas, pues estos estarán detallados en un documento específico por cada épica.

## Supuestos y restricciones

Este plan de pruebas se desarrolla posterior a la creación y refinamiento de cada una de las Historias de Usuario, pues las tiene como base de creación. Las pruebas serán implementadas al culminar la fase de desarrollo de cada una de las épicas especificadas. Es importante mencionar que este conjunto de documentos únicamente cubre las pruebas de aceptación generales de los CA, así como la integración de cada HU dentro de cada épica, especificado en cada suite de pruebas dividida por épicas.

## Organización y roles (Implicados)

Las pruebas serán realizadas por épica; cada épica representa una sección específica del sistema (login/registro, creación y gestión de tickets, entre otras).

**Responsables de realizar las pruebas:**
- QA como tester principal
- BA y SM para pruebas de sistema
- Dev para pruebas unitarias
- Equipo completo para pruebas estáticas y early testing

**Usuarios sobre los que se realizarán las pruebas:**
- Agentes
- Supervisores

## Criterios de salida (Exit Criteria)

Las condiciones de cierre para cada suite de pruebas están dadas por:
- El cumplimiento total de la Definition of Done (DoD) de cada HU.
- El cumplimiento de más del 90% de los casos de prueba de nivel bajo.
- El cumplimiento del 100% de los casos de prueba con nivel crítico.

## Priorización de pruebas y gestión de riesgos

En cada suite de pruebas se detallan los casos de prueba agrupados por épica (un documento específico representa un suite de pruebas por cada épica o grupo de HUs). Cada caso de prueba presenta un nivel de prioridad o criticidad, que representa tanto el orden en que se realizará la prueba como la importancia que tiene la sección probada sobre el funcionamiento del producto.

Para estimar dichos riesgos se hará uso de las siguientes técnicas (ordenadas por prioridad):

1. **Basada en requisitos:** priorización de secciones y criticidad dada directamente por el BA.
2. **Basada en cobertura:** priorizando los casos que cubran una mayor cantidad de secciones.
3. **Basada en riesgos:** priorizando los casos que representen mayor riesgo, tanto al funcionamiento como a la seguridad del sistema.

## Enfoque de prueba

Desglose de secciones a probar y generalidades de las mismas, divididas por épicas.

### Épica: Autenticación y Seguridad

HUs contempladas:
- **HU Login** — inicio de sesión con credenciales, validaciones de campos, redirección a dashboard.
- **HU Protección de Rutas** — redirección a login si no hay sesión, bloqueo de acceso según rol (agente vs. supervisor).

**Cohesión:** ambas HUs giran en torno a "quién puede entrar y a qué puede acceder"; son prerrequisito técnico para todo lo demás.

- [Link a suite de prueba]()

### Épica: Gestión de Tickets

HUs contempladas:
- **HU01 Lista de Tickets** — tabla con filtros por estado, visibilidad según rol.
- **HU02 Detalle de ticket e historial** — ver detalle e historial de cambios de un ticket.
- **HU Creación de Tickets** — alta de tickets, con reglas de asignación según rol.
- **HU Edición de Tickets** — edición de campos limitados, permisos y reglas por estado.

**Cohesión:** es el CRUD completo del objeto "ticket" (crear, listar, ver detalle/historial, editar); todas comparten el mismo modelo de datos y las mismas reglas de rol (el agente ve/edita lo suyo, el supervisor ve/edita todo).

- [Link a suite de prueba]()

### Épica: Dashboard y Métricas

HUs contempladas:
- **HU03 Dashboard de métricas** — conteo de tickets por estado y tiempo promedio de cierre, exclusivo para Supervisor.

**Cohesión:** es analítica/reporting sobre los datos generados por la épica de Gestión de Tickets, con acceso restringido a un solo rol, por lo que suele vivir aparte como épica propia de "Reporting".

- [Link a suite de prueba]()
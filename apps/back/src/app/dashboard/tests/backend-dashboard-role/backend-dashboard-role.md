# Prueba automatizada de acceso al dashboard en backend

## Alcance

Se automatizó la validación del control de acceso por rol para una pantalla tipo dashboard, conforme a la regla de negocio de seguridad del sistema: solo un Supervisor debe poder entrar.

Debido a que la API del dashboard aún no está implementada, esta prueba no valida el cálculo de métricas ni el endpoint real de `/metrics`, sino la regla de autorización que debe aplicarse en backend antes de exponer cualquier dato del dashboard.

## Técnica utilizada

Se aplicó partición de equivalencia:

- clase válida: rol `admin` o `supervisor`
- clase inválida: rol `user` o sin rol

## Set de datos

Se usaron roles controlados para evaluar el permiso:

- `admin` => permitido
- `supervisor` => permitido
- `user` => denegado
- `undefined` => denegado
- `guest` => denegado

## Criterio de evaluación

La prueba pasa si:

- el backend autoriza el acceso cuando el usuario es Supervisor,
- bloquea el acceso para Agente y roles no autorizados,
- mantiene la regla de seguridad centralizada en backend y no depende del frontend.

## Resultado real

La validación quedó automatizada y ejecutada con Jest sobre backend. La parte de métricas del dashboard no pudo automatizarse todavía porque la API y los servicios de métricas aún no existen en la implementación actual.

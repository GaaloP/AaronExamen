# Prueba automatizada de seguridad de autenticación en backend

## Alcance

Se automatizó la validación del comportamiento del backend para:

- login exitoso con credenciales válidas,
- bloqueo de acceso con credenciales inválidas,
- rechazo de autenticación cuando no existe usuario o la contraseña es incorrecta.

## Técnica utilizada

Se aplicó partición de equivalencia:

- Clase válida: usuario registrado con credenciales correctas.
- Clase inválida: usuario inexistente o contraseña incorrecta.


## Set de datos

Se usaron datos controlados con usuarios simulados:

- Agente válido: `agent@test.com` / `Pass1234!`
- Usuario inexistente: `noexiste@test.com` / `Pass1234!`
- Contraseña incorrecta: `agent@test.com` / `WrongPassword123!`

## Criterio de evaluación

La prueba pasa si:

- con credenciales válidas el servicio responde con token y datos de usuario,
- con credenciales inválidas lanza `UnauthorizedException`,
- el mensaje devuelto es exactamente `Las credenciales son incorrectas`,
- el backend no entrega información adicional ni genera sesión válida.

## Evidencia del resultado

El caso quedó validado mediante la ejecución del conjunto de pruebas del backend con Jest.

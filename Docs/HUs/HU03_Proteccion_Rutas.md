# HU03 Login 

Como: Agente o Supervisor

Quiero: que al iniciar sesión el sistema me lleve a mi pantalla de inicio de acuerdo a mi rol

Para: Asegurar que las rutas con mi información se encuentran protegidas

---


## Notas técnicas:
* **Inclusión del Token JWT:**
  * En todas las llamadas a endpoints protegidos se debe incluir el token de autenticación en el header HTTP: `Authorization: Bearer <token>`
* **Gestión de Sesión y Redirección a Login:**
  * El token JWT caduca según el valor especificado en `expiresIn` / tiempo de vida de 24 horas.
  * Si la API retorna una respuesta **HTTP 401 (No autenticado)** ("El token de autenticación no fue proporcionado o ha expirado"), se debe limpiar el estado de autenticación y redirigir automáticamente al usuario al Login
* **Control de Accesos por Rol (RBAC):**
  * Se debe verificar el atributo `user.role` (`"supervisor"` o `"agente"`) almacenado en Redux al navegar a cualquier ruta protegida
  * Ante una respuesta **HTTP 403 (Acceso denegado)** ("No cuentas con los permisos necesarios para acceder a este recurso") o si un usuario con rol "agente" intenta ingresar mediante URL a una vista exclusiva de supervisor, el sistema debe bloquear el acceso y mantener al usuario en su vista permitida

---

## Notas de QA:

---

## Criterios de aceptación:

## AC1: Extructura JWT

- Poner aqui estructura

## AC2: Proteccion de rutas - Redireccion a Login

- Para garantizar la seguridad de la informacion dentro del sistema se deben proteger las rutas. : si el usuario no está autenticado, redirige a login

## AC3: Bloqueo de accesos segun rol

-  Si el rol no corresponde a la pantalla, se bloquea el acceso a la misma
-  Los agentes no deben poder llegar a una vista de Supervisor ni escribiendo la URL directamente.

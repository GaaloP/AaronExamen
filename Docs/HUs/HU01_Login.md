# HU01 Login 

Como: Agente o Supervisor

Quiero: Iniciar sesion en mi cuenta con mis credenciales

Para: Poder acceder a la plataforma e interactuar con el sistema 

---

## Assets:

Diseño en figma de pantalla de login https://www.figma.com/design/9zrlV8TENgr4d9UjbmbPRP/Login-%7C-Web-Login-%7C-ziontutorial.com--Community-?node-id=1-21&t=BzHcEcXhCqxhPQ6p-0

---

## Contexto:

Esta es la primera pantalla con la que un usuario no loggeado se encontrara, se compone del nombre del proyecto y un formulario con campos para correo electronico y contraseña así como el boton de "Iniciar Sesión".

---


## Notas técnicas:

* **Método y Endpoint:** `POST /api/v1/auth/login`
* **Headers:** `Content-Type: application/json`
* **Payload de entrada (Request Body):**
  ```json
  {
    "email": "string",
    "password": "string"
  }
Respuesta Exitosa (HTTP 200):  JSON{
  "message": "Login successful",
  "data": {
    "accessToken": "string",
    "expiresIn": "number",
    "user": {
      "role": "string",
      "fullName": "string",
      "uuid": "string"
    }
  }
}
Almacenamiento en Redux: Al recibir una respuesta exitosa (200), se debe guardar en el estado global de Redux la información del usuario (user: uuid, fullName, role) y el token de acceso (accessToken).  Manejo de Respuestas de Error:  HTTP 400 (Petición inválida): Se devuelve si el body es incorrecto o contiene parámetros inváildos[cite: 4].HTTP 401 (No autorizado): Se devuelve si las credenciales no existen o son incorrectas en la base de datos[cite: 4].HTTP 500 (Error interno): Ocurre un error inesperado al procesar la solicitud en el servidor[cite: 4].
---

## Criterios de aceptación:

## AC1: Validacion de credenciales e inicio de sesión

- Un usuario solo puede acceder al sistema si las credenciales son correctas, si las credenciales son incorrectas debe aparecer una notificación que diga "El usuario o contraseña es incorrecto, intente de nuevo"
- Se debe consumir el endpoint de autenticación para poder iniciar sesión con un usuario
- La sesión debe guardarse en un estado global de Redux

## AC2: Campo correo

- El campo es obligatorio
- El campo debe contar con validaciones para verificar que el input sea un correo electronico
- Basarse en el siguiente estandar para especificar las validaciones de caracteres raros: https://mailrelay.com/es/blog/2012/01/11/caracteres_especiales_en_emails/ , Validar expresamene que contenga  un unico @

## AC3: Campo contraseña

- El campo es obligatorio
- El campo tendra un icono de ojo para revelar/ocultar la contraseña
- Si se intenta ingresar dando click al boton sin este campo llenado aparecera la validacion "La contraseña es obligatoria"

## AC4: Diseño UI

- La pantalla debe seguir el diseño, orden y estructura mostrada en el figma

## AC5: Redireccion a dashboard

- Una vez se logre un inicio de sesión exitoso al dar click en el boton "Iniciar Sesión" se debe redirigir al usuario al dashboard
- 
## AC6: Tiempo de vida de sesión

- Cada sesión tendra un tiempo de vida de 24 horas
- Una vez finalizado el tiempo de vida se le debe solicitar al usuario iniciar sesión nuevamente
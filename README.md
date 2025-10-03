# Proyecto de formulario de inicio de sesión

Este proyecto ofrece un formulario sencillo que envía las credenciales al endpoint `/api/login`.

## Instrucciones de despliegue

1. Sirve el contenido estático de este repositorio desde el origen deseado.
2. Abre `index.html` y localiza el formulario con el atributo `data-api-base`.
3. Establece `data-api-base` con la URL base del servidor de API. Puedes proporcionar:
   - La URL completa con protocolo, por ejemplo `https://api.ejemplo.com`.
   - Un host con puerto (`LGOMEZ:3000`), en cuyo caso se asumirá `http://`.
   - Una ruta relativa (`/proxy/api`), que se resolverá respecto al origen desde el que se sirva la página.
   ```html
   <form id="login-form" data-api-path="/api/login" data-api-base="http://LGOMEZ:3000">
   ```
4. (Opcional) Define `data-api-base-fallback` para proporcionar una segunda URL base que se usará si la base principal no es válida. Se aplican las mismas reglas de normalización descritas arriba.
5. Si no se especifica ninguna base, el código utilizará automáticamente `window.location.origin`.

Con estos ajustes la aplicación podrá apuntar explícitamente a `http://LGOMEZ:3000/api/login` u otra instancia sin necesidad de modificar el código fuente de JavaScript.

const DEFAULT_API_PATH = '/api/login';

const buildEndpoint = (base, path) => {
  const sanitizedBase = (base || '').trim();
  const sanitizedPath = (path || DEFAULT_API_PATH).trim() || DEFAULT_API_PATH;
  const ensuredBase = sanitizedBase.endsWith('/') ? sanitizedBase : `${sanitizedBase}/`;

  try {
    return new URL(sanitizedPath, ensuredBase || window.location.origin).toString();
  } catch (error) {
    const fallbackBase = window.location.origin.endsWith('/')
      ? window.location.origin
      : `${window.location.origin}/`;
    return new URL(sanitizedPath, fallbackBase).toString();
  }
};

const resolveApiBase = (form) => {
  if (!form) return window.location.origin;

  const candidates = [form.dataset.apiBase, form.dataset.apiBaseFallback, window.location.origin];
  for (const candidate of candidates) {
    if (candidate && candidate.trim().length > 0) {
      try {
        return new URL(candidate, window.location.origin).toString().replace(/\/?$/, '/');
      } catch (error) {
        console.warn('No se pudo interpretar la base del API proporcionada:', candidate, error);
      }
    }
  }
  return window.location.origin.endsWith('/') ? window.location.origin : `${window.location.origin}/`;
};

const showMessage = (element, message) => {
  if (!element) return;
  element.textContent = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-api-path]');
  if (!form) {
    console.warn('No se encontró un formulario con atributo data-api-path.');
    return;
  }

  const statusElement = document.querySelector('[data-login-status]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const apiBase = resolveApiBase(form);
    const apiPath = form.dataset.apiPath || DEFAULT_API_PATH;
    const endpoint = buildEndpoint(apiBase, apiPath);

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    showMessage(statusElement, 'Enviando credenciales...');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (_error) {
        parsed = text;
      }

      if (response.ok) {
        showMessage(statusElement, parsed || 'Autenticación exitosa.');
      } else {
        const message = parsed || `Error ${response.status}`;
        showMessage(statusElement, message);
      }
    } catch (error) {
      showMessage(statusElement, `Error al conectar con el API: ${error.message}`);
    }
  });
});

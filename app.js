const DEFAULT_API_PATH = '/api/login';
const PROTOCOL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;

const ensureTrailingSlash = (value) => {
  if (!value) return '';
  return value.endsWith('/') ? value : `${value}/`;
};

const ensureLeadingSlash = (value) => {
  if (!value) return '/';
  return value.startsWith('/') ? value : `/${value}`;
};

const resolveCurrentOrigin = () => {
  const { origin, protocol, host } = window.location;
  if (origin && origin !== 'null') {
    return ensureTrailingSlash(origin);
  }
  if (protocol && host) {
    return ensureTrailingSlash(`${protocol}//${host}`);
  }
  return '';
};

const normalizeBase = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';

  if (PROTOCOL_REGEX.test(trimmed)) {
    return ensureTrailingSlash(trimmed);
  }

  if (trimmed.startsWith('//')) {
    const protocol = window.location.protocol || 'https:';
    return ensureTrailingSlash(`${protocol}${trimmed}`);
  }

  if (trimmed.startsWith('/')) {
    const origin = resolveCurrentOrigin();
    if (!origin) return '';
    const url = new URL(trimmed, origin);
    return ensureTrailingSlash(url.toString());
  }

  return ensureTrailingSlash(`http://${trimmed}`);
};

const buildEndpoint = (base, path) => {
  const origin = resolveCurrentOrigin();
  const normalizedBase = normalizeBase(base) || origin;
  const sanitizedPath = ensureLeadingSlash((path || DEFAULT_API_PATH).trim() || DEFAULT_API_PATH);

  try {
    return new URL(sanitizedPath, normalizedBase || origin).toString();
  } catch (error) {
    console.warn('Fallo al componer la URL del endpoint, usando el origen actual como respaldo:', error);
    const fallback = origin || 'http://localhost/';
    return new URL(sanitizedPath, ensureTrailingSlash(fallback)).toString();
  }
};

const resolveApiBase = (form) => {
  const origin = resolveCurrentOrigin();
  if (!form) return origin;

  const candidates = [form.dataset.apiBase, form.dataset.apiBaseFallback];
  for (const candidate of candidates) {
    const normalized = normalizeBase(candidate);
    if (normalized) {
      try {
        return ensureTrailingSlash(new URL('.', normalized).toString());
      } catch (error) {
        console.warn('No se pudo interpretar la base del API proporcionada:', candidate, error);
      }
    }
  }

  return origin;
};

const formatStatusMessage = (message, endpoint) => {
  const lines = [];
  if (endpoint) {
    lines.push(`Endpoint en uso: ${endpoint}`);
  }
  if (message !== undefined && message !== null) {
    if (typeof message === 'string') {
      lines.push(message);
    } else {
      lines.push(JSON.stringify(message, null, 2));
    }
  }
  return lines.join('\n\n');
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

    if (statusElement) {
      statusElement.textContent = formatStatusMessage('Enviando credenciales...', endpoint);
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
      });

      const text = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (_error) {
        parsed = text;
      }

      if (statusElement) {
        if (response.ok) {
          statusElement.textContent = formatStatusMessage(parsed || 'Autenticación exitosa.', endpoint);
        } else {
          const message = parsed || `Error ${response.status}`;
          statusElement.textContent = formatStatusMessage(message, endpoint);
        }
      }
    } catch (error) {
      if (statusElement) {
        statusElement.textContent = formatStatusMessage(`Error al conectar con el API: ${error.message}`, endpoint);
      }
    }
  });
});

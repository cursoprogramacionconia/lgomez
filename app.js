const loginForm = document.getElementById('loginForm');
const feedback = document.getElementById('feedback');
const submitButton = loginForm.querySelector('button[type="submit"]');

function mostrarMensaje(tipo, mensaje) {
  feedback.className = `alert alert-${tipo} mt-3`;
  feedback.textContent = mensaje;
  feedback.classList.remove('d-none');
}

function limpiarMensaje() {
  feedback.classList.add('d-none');
  feedback.textContent = '';
}

async function iniciarSesion(event) {
  event.preventDefault();
  limpiarMensaje();

  if (!loginForm.checkValidity()) {
    loginForm.classList.add('was-validated');
    return;
  }

  const correo = loginForm.correo.value.trim();
  const password = loginForm.password.value;

  submitButton.disabled = true;
  submitButton.textContent = 'Validando...';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo, password })
    });

    const data = await response.json();

    if (!response.ok) {
      const tipoAlerta = response.status === 403 ? 'warning' : 'danger';
      mostrarMensaje(tipoAlerta, data.mensaje || 'No fue posible iniciar sesión.');
      return;
    }

    mostrarMensaje('success', `${data.mensaje} Bienvenido, ${data.usuario.nombre_completo}.`);
    loginForm.reset();
    loginForm.classList.remove('was-validated');
  } catch (error) {
    console.error('Error al llamar a la API:', error);
    mostrarMensaje('danger', 'No se pudo contactar al servidor. Intenta nuevamente.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Iniciar Sesión';
  }
}

loginForm.addEventListener('submit', iniciarSesion);

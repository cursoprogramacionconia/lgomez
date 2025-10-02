const usuarios = [
  {
    id: '9f3b9b0a-1234-4f43-a112-0e4b4f80e001',
    correo: 'admin@clinica.com',
    password: 'Admin123',
    nombre_completo: 'Administrador Clínica',
    id_medico: null,
    activo: 1,
    fecha_creacion: '2024-05-01T08:30:00Z'
  },
  {
    id: '4a689b6d-7e4e-43a9-ae3f-9286ee7abf02',
    correo: 'medico@clinica.com',
    password: 'Medico123',
    nombre_completo: 'María González',
    id_medico: 'c78bd019-24fd-46b8-b94d-2d331b194c33',
    activo: 1,
    fecha_creacion: '2024-05-02T10:45:00Z'
  },
  {
    id: '08c45b71-d50c-49ea-8b76-1274f8181c45',
    correo: 'inactivo@clinica.com',
    password: 'Inactivo123',
    nombre_completo: 'Usuario Inactivo',
    id_medico: null,
    activo: 0,
    fecha_creacion: '2024-05-03T12:00:00Z'
  }
];

const loginForm = document.getElementById('loginForm');
const feedback = document.getElementById('feedback');

function mostrarMensaje(tipo, mensaje) {
  feedback.className = `alert alert-${tipo} mt-3`;
  feedback.textContent = mensaje;
  feedback.classList.remove('d-none');
}

function limpiarMensaje() {
  feedback.classList.add('d-none');
  feedback.textContent = '';
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  limpiarMensaje();

  if (!loginForm.checkValidity()) {
    loginForm.classList.add('was-validated');
    return;
  }

  const correo = loginForm.correo.value.trim().toLowerCase();
  const password = loginForm.password.value;

  const usuario = usuarios.find(
    (user) => user.correo.toLowerCase() === correo && user.password === password
  );

  if (!usuario) {
    mostrarMensaje('danger', 'Correo o contraseña incorrectos.');
    return;
  }

  if (usuario.activo !== 1) {
    mostrarMensaje('warning', 'Tu usuario está inactivo. Comunícate con el administrador.');
    return;
  }

  mostrarMensaje('success', `Bienvenido, ${usuario.nombre_completo}. Inicio de sesión exitoso.`);
  loginForm.reset();
  loginForm.classList.remove('was-validated');
});

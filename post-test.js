import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://quickpizza.grafana.com/api';

export const options = {
  vus: 1,   // número de usuarios virtuales
  duration: '10s', // duración del test
};

export default function () {
  // Generamos un usuario único por cada iteración
  const uniqueId = `${__VU}_${__ITER}_${Math.floor(Math.random() * 100000)}`;
  const username = `usuario_${uniqueId}`;
  const password = 'contraseñaSegura123';

  registerUser(username, password);
  loginUser(username, password);
}

export function registerUser(username, password) {
  const payload = JSON.stringify({
    username: username,
    password: password
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/users`, payload, params);

  check(res, {
    'registro status 201': (r) => r.status === 201,
    'registro tiene id': (r) => r.json().hasOwnProperty('id'),
  });
  sleep(1);
}

export function loginUser(username, password) {
  const payload = JSON.stringify({
    username: username,
    password: password
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/users/token/login`, payload, params);

  check(res, {
    'login status 200': (r) => r.status === 200,
    'login tiene token': (r) => r.json().hasOwnProperty('token'),
  });
  sleep(1);
}

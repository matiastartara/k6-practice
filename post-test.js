import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://quickpizza.grafana.com/api';

export const options = {
  vus: 1,   // número de usuarios virtuales
  duration: '10s', // duración del test
};

export default function () {
  registerUser();
  loginUser();
}

export function registerUser() {
  const payload = JSON.stringify({
    username: 'usuarioDePrueba',
    password: 'contraseñaSegura'
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

export function loginUser() {
  const payload = JSON.stringify({
    username: 'usuarioDePrueba',
    password: 'contraseñaSegura'
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

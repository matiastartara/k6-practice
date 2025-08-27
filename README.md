# Pruebas de Rendimiento con k6 para QuickPizza

Este proyecto contiene scripts de k6 para realizar pruebas de carga y estrés sobre el endpoint de `quickpizza.grafana.com`.

## Cómo Ejecutar las Pruebas

Asegúrate de tener k6 instalado.

Para ejecutar el script de prueba básico, usa el siguiente comando en tu terminal:

```bash
k6 run test-example.js
```

## Glosario de Métricas de Rendimiento

Al finalizar una prueba, k6 muestra un resumen con varias métricas. Aquí se explica el significado de las más importantes:

---

### **Usuarios Virtuales (Virtual Users - `vus`)**

*   **Definición:** Simulan usuarios reales que interactúan con tu aplicación. Cada VU es un hilo de ejecución paralelo que ejecuta tu script en un bucle.
*   **Uso:** La cantidad de `vus` define el nivel de concurrencia de la prueba. `vus_max` indica el número máximo de VUs que se alcanzaron durante la prueba.

---

### **Throughput (Rendimiento)**

*   **Definición:** Es la cantidad de trabajo que tu sistema puede manejar en un período de tiempo. Generalmente se mide en **peticiones por segundo (requests per second - RPS)**.
*   **Métrica en k6:** `http_reqs` es el contador total de peticiones HTTP realizadas. El throughput se muestra como `(XXXX/s)` al lado de esta métrica.

---

### **Duración de la Petición (`http_req_duration`)**

*   **Definición:** Es el tiempo total que tarda una petición desde que se envía hasta que se recibe la respuesta completa. Se descompone en:
    *   `http_req_sending`: Tiempo para enviar los datos de la petición al servidor.
    *   `http_req_waiting`: Tiempo de espera por el primer byte de la respuesta (Time To First Byte - TTFB). A menudo se le llama **latencia**.
    *   `http_req_receiving`: Tiempo para recibir el cuerpo completo de la respuesta.
*   **Uso:** Es la métrica principal para medir qué tan "rápida" es tu aplicación desde la perspectiva del usuario.

---

### **Métricas de Agregación (avg, med, min, max)**

k6 muestra estas estadísticas para las métricas de tendencia como `http_req_duration`.

*   **`avg` (Promedio):** La media aritmética de todos los valores. **Cuidado:** puede ser engañosa si hay valores atípicos (outliers) muy altos o muy bajos.
*   **`med` (Mediana):** El valor que se encuentra justo en el medio de todos los resultados ordenados. Es el percentil 50 (`p(50)`). Es una medida más robusta que el promedio porque no se ve afectada por outliers.
*   **`min` y `max`:** El valor mínimo y máximo registrados durante la prueba. Útiles para entender el rango de tiempos de respuesta.

---

### **Percentiles (p90, p95, p99)**

*   **Definición:** Los percentiles son la métrica más importante para entender la experiencia de la mayoría de tus usuarios.
*   **Ejemplo (`p(95)`):** Si `p(95)` para `http_req_duration` es `500ms`, significa que el **95% de las peticiones tardaron menos de 500ms** en completarse. El 5% restante tardó más.
*   **Uso:** Se usan para definir los Objetivos de Nivel de Servicio (SLOs). Por ejemplo: "El 95% de las peticiones a la página de inicio deben responder en menos de 300ms".

---

### **Tasa de Errores (`http_req_failed`)**

*   **Definición:** Es el porcentaje de peticiones que no tuvieron éxito. k6 considera una petición como fallida si la respuesta no es un código HTTP 2xx o 3xx (por defecto), o si hay un error de red.
*   **Métrica en k6:** Se muestra como una tasa (`rate`). `rate<0.01` en un `threshold` significa que se espera que menos del 1% de las peticiones fallen.

---

### **Checks (`checks`)**

*   **Definición:** Son aserciones o validaciones que defines dentro de tu script (por ejemplo, `check(res, { 'status is 200': (r) => r.status === 200 })`).
*   **Uso:** Permiten verificar que el sistema no solo responde, sino que responde correctamente (el estado es el esperado, el cuerpo contiene cierto texto, etc.). La métrica `checks` te muestra el porcentaje de éxito de estas validaciones.

---

### **Umbrales (Thresholds)**

*   **Definición:** Son los criterios de éxito o fracaso que definen si una prueba de rendimiento pasa o falla. Permiten automatizar la validación de los objetivos de rendimiento (SLOs).
*   **Uso:** Se definen en el objeto `options` del script. Si no se cumple alguno de los umbrales, k6 terminará con un código de estado de error, lo cual es ideal para integraciones continuas (CI/CD).
*   **Ejemplo:**
    ```javascript
    export const options = {
      thresholds: {
        'http_req_duration': ['p(95)<500'], // El 95% de las peticiones deben ser menores a 500ms
        'http_req_failed': ['rate<0.01'],   // La tasa de errores debe ser menor al 1%
      },
    };
    ```

## Tipos de Pruebas de Rendimiento

*   **Load Test (Prueba de Carga):** Simula una carga de usuarios esperada y normal para verificar que el sistema se comporta según lo previsto.
*   **Stress Test (Prueba de Estrés):** Aumenta la carga progresivamente para encontrar el punto de quiebre del sistema y ver cómo se recupera.
*   **Spike Test (Prueba de Picos):** Simula picos de carga repentinos y masivos para evaluar la capacidad del sistema de manejar ráfagas de tráfico.
*   **Soak Test (Prueba de Resistencia):** Aplica una carga moderada durante un período prolongado (horas o días) para detectar problemas como fugas de memoria (memory leaks).

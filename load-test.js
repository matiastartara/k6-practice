import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    stages : [
        { duration: '10s', target: 10 }, // Ramp up to 100 VUs over 3m
        { duration: '30s', target: 10 }, // Stay at 100 VUs for 3m
        { duration: '10s', target: 0 }, // Ramp down to 0 VUs over 3ms
    ],
};

export default function () {
    http.get('https://quickpizza.grafana.com/');
    sleep(1);
    http.get('https://quickpizza.grafana.com/contacts.php');
    sleep(1);
    http.get('https://quickpizza.grafana.com/news.php');
    sleep(1);
}
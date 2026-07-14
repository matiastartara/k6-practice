import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    stages : [
        { duration: '10s', target: 10 }, // Ramp up
        { duration: '30s', target: 10 }, // Stay
        { duration: '10s', target: 0 }, // Ramp down
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
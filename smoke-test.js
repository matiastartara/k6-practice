import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend } from 'k6/metrics';

export const options = {
    vus: 1,
    duration: '2s',
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% de las solicitudes deben completarse en menos de 500ms
        http_reqs: ['count>0'], // Debe haber al menos una solicitud
        response_time_news_page: ['p(95)<700'], // 95% de las solicitudes a la página de noticias deben completarse en menos de 700ms
    },
};

let newsPageResponseTrend = new Trend(('response_time_news_page'));

export default function () {

    group('QuickPizza Homepage', function () {
        let req = http.get('https://quickpizza.grafana.com/');

        check(req, {
            'status was 200': (r) => r.status === 200,
            'body has correct title': (r) => r.html().find('title').text() === 'QuickPizza',
        });

        console.log('Response time was ' + String(req.timings.duration) + ' ms');
        console.log('Response status was ' + String(req.status));
        sleep(1);
    });

    group('K6 News Page', function () {
        let req2 = http.get('https://test.k6.io/news');
        newsPageResponseTrend.add(req2.timings.duration);
        sleep(1);
    });

}
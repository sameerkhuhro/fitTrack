const http = require('http');

console.log('=== VERIFYING FITTRACK PRO LIVE SERVERS ===');

http.get('http://localhost:5173', (res) => {
  let body = '';
  res.on('data', (c) => (body += c));
  res.on('end', () => {
    console.log('✔ Vite Client: Status =', res.statusCode);
    console.log('✔ Vite Client: Title =', body.match(/<title>(.*?)<\/title>/)?.[1]);
    console.log('✔ Vite Client: Includes Root =', body.includes('<div id="root"></div>'));
  });
}).on('error', (e) => console.error('Client Error:', e.message));

http.get('http://localhost:5000/api/v1/plans', (res) => {
  let body = '';
  res.on('data', (c) => (body += c));
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      console.log('✔ Backend API /plans: Status =', res.statusCode, '| Count =', json.data?.length);
      console.log('✔ Live Atlas Plans:', json.data?.map((p) => `${p.name} (PKR ${p.price?.toLocaleString()})`).join(', '));
    } catch (err) {
      console.error('JSON parse error:', err.message);
    }
  });
}).on('error', (e) => console.error('Backend Error:', e.message));

http.get('http://localhost:5000/api/v1/trainers', (res) => {
  let body = '';
  res.on('data', (c) => (body += c));
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      console.log('✔ Backend API /trainers: Status =', res.statusCode, '| Count =', json.data?.length);
      console.log('✔ Live Atlas Trainers:', json.data?.map((t) => t.name).join(', '));
    } catch (err) {
      console.error('JSON parse error:', err.message);
    }
  });
}).on('error', (e) => console.error('Backend Error:', e.message));


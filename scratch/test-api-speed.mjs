import http from 'http';

function measureEndpoint(path) {
  return new Promise((resolve) => {
    const start = performance.now();
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const duration = Math.round(performance.now() - start);
        const cacheHeader = res.headers['x-cache'] || 'N/A';
        resolve({ path, statusCode: res.statusCode, durationMs: duration, cache: cacheHeader });
      });
    }).on('error', (err) => {
      resolve({ path, statusCode: 500, durationMs: -1, error: err.message });
    });
  });
}

async function testAllApis() {
  console.log('⚡ Testing API Response Times:\n');

  const endpoints = [
    '/api/categories',
    '/api/products',
    '/api/products?sort=newest',
    '/api/products/ranger-tatkal-software',
    '/api/products/gadar-tatkal-software',
  ];

  // Warm-up pass
  for (const ep of endpoints) {
    await measureEndpoint(ep);
  }

  // Measured pass
  for (const ep of endpoints) {
    const res = await measureEndpoint(ep);
    console.log(`- ${res.path.padEnd(45)} → ${res.durationMs} ms [Status: ${res.statusCode}, Cache: ${res.cache}]`);
  }
}

testAllApis();

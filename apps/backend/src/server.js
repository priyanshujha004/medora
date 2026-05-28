const http = require('http');
const app = require('./app');
const { PORT } = require('./config/env');

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Medora API running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different PORT in .env`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[32m%s\x1b[0m', '=====================================================');
console.log('\x1b[32m%s\x1b[0m', '   FitTrack Pro – Dual Service Concurrent Runner     ');
console.log('\x1b[32m%s\x1b[0m', '   Starting Backend API (:5000) & Vite Frontend (:5173)');
console.log('\x1b[32m%s\x1b[0m', '=====================================================');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// Spawn Backend Server
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(__dirname, '../server'),
  stdio: 'inherit',
  shell: true,
});

// Spawn Frontend Client
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(__dirname, '../client'),
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n[FitTrack] Shutting down services gracefully...');
  if (isWin) {
    if (server.pid) spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t']);
    if (client.pid) spawn('taskkill', ['/pid', client.pid.toString(), '/f', '/t']);
  } else {
    server.kill('SIGINT');
    client.kill('SIGINT');
  }
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[Server] Process exited with code ${code}`);
  }
});

client.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[Client] Process exited with code ${code}`);
  }
});


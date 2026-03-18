const { spawn } = require('child_process');
const http = require('http');

console.log('Starting backend server...');
const server = spawn('node', ['server.js'], { stdio: 'pipe' });

let output = '';
server.stdout.on('data', data => { output += data.toString(); });
server.stderr.on('data', data => { output += data.toString(); });

setTimeout(() => {
  console.log('Pinging health check...');
  http.get('http://localhost:5000/api/v1', (res) => {
    console.log(`Health check statusCode: ${res.statusCode}`);
    server.kill();
    require('fs').writeFileSync('verify_log.txt', 'SUCCESS\n' + output);
    process.exit(0);
  }).on('error', (e) => {
    console.log(`Health check failed: ${e.message}`);
    server.kill();
    require('fs').writeFileSync('verify_log.txt', 'FAILED\n' + output + '\n' + e.message);
    process.exit(1);
  });
}, 3000);

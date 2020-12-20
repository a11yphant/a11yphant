const { spawn, exec } = require('child_process');

spawn("pm2", ["start", "pm2-ecosystem.config.js", "--no-daemon"], { stdio: "inherit" });

process.on('SIGINT', function() {
  exec("npm run stop");
});

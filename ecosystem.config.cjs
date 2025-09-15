module.exports = {
  apps: [
    {
      name: 'verifybox-proxy',
      script: 'proxy/server.cjs',
      cwd: '/var/www/verifyboxlending',
      env_file: '.env',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/proxy-error.log',
      out_file: './logs/proxy-out.log',
      log_file: './logs/proxy-combined.log',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'verifybox-webhook',
      script: 'webhook-server.cjs',
      cwd: '/var/www/verifyboxlending',
      env_file: '.env',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/webhook-error.log',
      out_file: './logs/webhook-out.log',
      log_file: './logs/webhook-combined.log',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
};

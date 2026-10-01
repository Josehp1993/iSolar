module.exports = {
  apps: [{
    name: 'isolar',
    script: 'node_modules/.bin/next',
    args: 'start -p 3002',
    cwd: '/var/www/isolar',
    env: {
      NODE_ENV: 'production',
    },
  }],
};

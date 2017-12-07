const Application = require('thinkjs');

const instance = new Application({
  ROOT_PATH: __dirname,
  RESOURCE_PATH: '/usr/share/nginx/html/fastfood-upload',
  proxy: true, // use proxy
  env: 'production'
});

instance.run();

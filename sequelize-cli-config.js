const path = require('path');

module.exports = {
  'config': path.resolve(__dirname, 'src', 'database', 'sequelize.config.ts'),
  'models-path': path.resolve(__dirname, 'src', 'models'),
  'migrations-path': path.resolve(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': path.resolve(__dirname, 'src', 'database', 'seeders'),
};
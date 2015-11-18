var lint = require('mocha-eslint');
lint(['.'], {
  formatter: 'stylish'
});

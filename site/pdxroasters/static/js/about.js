require.config({
  paths: {
    'jquery':  'lib/jquery-1.10.2.min'
  },
  shim: {
    'jquery': {
      exports: '$'
    }
  }
});

// Load modules and use them
require(['forms', 'jquery'], function(Forms, $){
  Forms.validate();
});
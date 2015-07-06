({
  baseUrl: 'build/app',
  paths: {
    // cdn
    'esri': 'empty:',
    'dojo': 'empty:',
    'dijit': 'empty:',
    'dojox': 'empty:',
    // src
    'js': 'js',
    'app': 'js/app',
    'map': 'js/map',
    'panel': 'js/panel',
    'util': 'js/util',
    'shim': 'shim',
    'lib': 'lib',
    // shim
    'babel-polyfill': 'shim/babel-polyfill/browser-polyfill',
    'fetch': 'shim/fetch/fetch',
    // vendor
    'alt': 'vendor/alt/dist/alt',
    'react': 'vendor/react/react.min',
    'ClusterFeatureLayer': 'vendor/cluster-layer-js/src/clusterfeaturelayer',
    'Chartjs': 'vendor/Chart.js/Chart.min'
  },
  name: 'js/main',
  out: 'dist/app/js/main.js',
})

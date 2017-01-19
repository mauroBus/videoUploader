(function() {

  angular.module('VideoApp', [
    // * Libs:
    'ui.bootstrap',
    'ui.router',
    'ngAnimate',
    'ngResource',
    // 'blueimp.fileupload',

    // * Template cache modules:
    'templates', // bag with all the modules html templates

    // * Common components:
    'VideoApp.commons',

    // * App modules:
    'VideoApp.main',
    'VideoApp.uploader',
    'VideoApp.preview'
  ])


  /*@ngInject*/
  .config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/uploader');
  })


  /*@ngInject*/
  .run(function($rootScope, $state) {

    // Workaround to use abstract states with default children:
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params);
      }
    });

  });

})();

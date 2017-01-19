(function() {
  angular.module('VideoApp.main', [])

  /*@ngInject*/
  .config(function($stateProvider) {

    $stateProvider.state('main', {
      url: '',
      template: '<main></main>',
      redirectTo: 'main.uploader' // workaround to use abstract with default children.
    });

  });

})();

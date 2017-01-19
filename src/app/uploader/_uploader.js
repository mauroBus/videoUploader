(function() {
  angular.module('VideoApp.uploader', [])

  /*@ngInject*/
  .config(function($stateProvider) {
    $stateProvider
      .state('main.uploader', {
        url: '/uploader',
        template: '<uploader></uploader>'
      });
  });

})();

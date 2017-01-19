(function() {

  angular.module('VideoApp.preview', [])

  /*@ngInject*/
  .config(function($stateProvider) {
    $stateProvider
      .state('main.preview', {
        url: '/preview/:videoId',
        template: '<preview></preview>'
      });
  });

})();

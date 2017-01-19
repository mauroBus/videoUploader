(function() {

  /*@ngInject*/
  function MainController() {
    var ctrl = this;

    ctrl.$onInit = function() {};
  }

  angular.module('VideoApp.main')
    .component('main', {
      templateUrl: 'main/main.html',
      controller: MainController
    });

})();

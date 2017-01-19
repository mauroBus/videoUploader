(function() {
  /*@ngInject*/

  function UploaderCtrl($state, $scope) {
    var ctrl = this;

    ctrl.onUpload = function(video) {
      $state.go('main.preview', {
        videoId: video.hashed_id
      });
    };

    ctrl.onFail = function(error) {
      ctrl.error = error.jqXHR.responseJSON.error;
      $scope.$apply();
    };
  }

  angular.module('VideoApp.uploader')
    .component('uploader', {
      templateUrl: 'uploader/uploader.html',
      controller: UploaderCtrl
    });

})();

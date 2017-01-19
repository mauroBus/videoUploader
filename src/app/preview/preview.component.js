(function() {

  /*@ngInject*/
  function PreviewCtrl($stateParams, $sce, $state, VideoUpoaderConstants) {
    var ctrl = this;
    ctrl.videoUrl = '';

    ctrl.$onInit = function() {
      var videoId = $stateParams.videoId;
      var url = VideoUpoaderConstants.EMBED_URL + videoId;

      ctrl.videoUrl = $sce.trustAsResourceUrl(url);
    };

    ctrl.goToUploadPage = function() {
      $state.go('main.uploader');
    };
  }

  angular.module('VideoApp.preview')
    .component('preview', {
      templateUrl: 'preview/preview.html',
      controller: PreviewCtrl
    });

})();

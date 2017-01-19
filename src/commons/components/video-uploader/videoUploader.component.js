(function() {

  /*@ngInject*/
  function VideoUploaderCtrl($element, $scope, VideoUpoaderConstants) {
    var ctrl = this;

    function reset() {
      ctrl.preview = null;
      ctrl.video = null;
      ctrl.progress = 0;
      ctrl.loading = false;
      ctrl.videoChosen = false;
    }

    ctrl.$onInit = function() {
      $element.fileupload({
        url: VideoUpoaderConstants.URL,

        formData: {
          api_password: VideoUpoaderConstants.PASSWORD,
          project_id: VideoUpoaderConstants.PROJECT_ID,
        },

        multipart: true,

        acceptFileTypes: /(\.|\/)(avi|asf|flv|MPG|MP4|WMV)$/i,

        loadVideoFileTypes: /(\.|\/)(avi|asf|flv|MPG|MP4|WMV)$/i,

        maxFileSize: ctrl.maxFileSize || 5000000, // 5Mb by default

        maxNumberOfFiles: 1,

        progressInterval: 500,

        add: function(e, data) {
          ctrl.video = data.originalFiles[0];
          ctrl.videoChosen = true;

          var fileReader = new FileReader();
          fileReader.readAsDataURL(ctrl.video);
          fileReader.onload = function(e) {
            ctrl.video.url = e.target.result;
            $scope.$apply();
          };

          $scope.$apply();
        },

        progressall: function(e, data) {
          ctrl.progress = parseInt(data.loaded / data.total * 100, 10);
          $scope.$apply();
        },

        done: function(e, data) {
          ctrl.onUpload(data.result);
          reset();
          $scope.$apply();
        },

        fail: function(e, data) {
          ctrl.onFail(data.response());
          reset();
          $scope.$apply();
        }
      });

      reset();
    };

    ctrl.upload = function() {
      if (ctrl.video) {
        $element.fileupload('send', {
          files: [ctrl.video]
        });

        ctrl.loading = true;
      }
    };

    ctrl.$onDestroy = function () {
      $element.fileupload('destroy');
    };
  }


  angular.module('VideoApp.commons')
    .component('videoUploader', {
      controller: VideoUploaderCtrl,
      templateUrl: 'components/video-uploader/video-uploader.html',
      bindings: {
        onUpload: '=',
        onFail: '=',
        maxFileSize: '@'
      }
    });

})();

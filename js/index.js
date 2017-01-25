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
  .config(["$urlRouterProvider", function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/uploader');
  }])


  /*@ngInject*/
  .run(["$rootScope", "$state", function($rootScope, $state) {

    // Workaround to use abstract states with default children:
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params);
      }
    });

  }]);

})();

(function() {
  angular.module('VideoApp.main', [])

  /*@ngInject*/
  .config(["$stateProvider", function($stateProvider) {

    $stateProvider.state('main', {
      url: '',
      template: '<main></main>',
      redirectTo: 'main.uploader' // workaround to use abstract with default children.
    });

  }]);

})();

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

(function() {

  angular.module('VideoApp.preview', [])

  /*@ngInject*/
  .config(["$stateProvider", function($stateProvider) {
    $stateProvider
      .state('main.preview', {
        url: '/preview/:videoId',
        template: '<preview></preview>'
      });
  }]);

})();

(function() {

  /*@ngInject*/
  PreviewCtrl.$inject = ["$stateParams", "$sce", "$state", "VideoUpoaderConstants"];
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

angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('main/main.html','<section class="section-main"> <h1>Video Uploader</h1> <div ui-view class="container"></div> </section> ');
$templateCache.put('preview/preview.html','<section class="preview-section"> <iframe data-ng-src="{{$ctrl.videoUrl}}" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed col-md-8" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="640" height="360"> </iframe> <div class="col-md-4"> <button class="btn btn-info pull-left" ng-click="$ctrl.goToUploadPage()"> Upload a New Video! </button> </div> </section> ');
$templateCache.put('uploader/uploader.html','<section class="uploader-section"> <video-uploader max-file-size="50000000" on-upload="$ctrl.onUpload" on-fail="$ctrl.onFail"> </video-uploader> <div class="col-md-10" data-ng-show="$ctrl.error"> <strong class="error text-danger"> Error: {{$ctrl.error}} <div> <span class="label label-warning">Video not loaded</span> </div> </strong> </div> </section> ');
$templateCache.put('components/video-uploader/video-uploader.html','<section id="video-uploader"> <div class="row fileupload-buttonbar"> <div class="col-lg-4 col-md-4"> <span class="btn btn-info fileinput-button"> <i class="glyphicon glyphicon-plus"></i> <span>Add Video...</span> <input type="file" name="files[]"> </span> <button type="button" class="btn btn-success start" ng-show="$ctrl.videoChosen" data-ng-click="$ctrl.upload()"> <i class="glyphicon glyphicon-upload"></i> <span>Upload To Wistia!</span> </button> </div> <div data-ng-show="$ctrl.loading" class="col-lg-4 col-md-4"> <p class="size">{{$ctrl.video.size | formatFileSize}}</p> <div class="progress progress-striped active fade in" data-ng-class="{ \'in\': $ctrl.loading  }"> <div class="progress-bar progress-bar-success" data-ng-style="{ width: $ctrl.progress + \'%\' }"> </div> </div> </div> </div> <ng-include src="\'components/video-uploader/preview/preview.html\'"></ng-include> </section> ');
$templateCache.put('components/video-uploader/preview/preview.html','<!-- Show the video file available for upload --> <section ng-show="$ctrl.videoChosen" class="video-preview col-lg-12"> <div class="col-md-6"> <div class="row"> <p>Video selected:</p> <a href="" class="thumbnail"> <video autobuffer autoloop loop controls data-ng-src="{{$ctrl.video.url}}" alt="..."> </video> </a> </div> <div class="col-md-4"> <p class="name"> <strong title="{{$ctrl.video.name}}"> {{$ctrl.video.name}} </strong> </p> </div> </div> </section> ');}]);
(function() {
  angular.module('VideoApp.uploader', [])

  /*@ngInject*/
  .config(["$stateProvider", function($stateProvider) {
    $stateProvider
      .state('main.uploader', {
        url: '/uploader',
        template: '<uploader></uploader>'
      });
  }]);

})();

(function() {
  /*@ngInject*/

  UploaderCtrl.$inject = ["$state", "$scope"];
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

/**
 * Setup for common modules.
 */

angular.module('VideoApp.commons', []);

(function() {

  /*@ngInject*/
  VideoUploaderCtrl.$inject = ["$element", "$scope", "VideoUpoaderConstants"];
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

(function() {
  /*
   * These constants are defined here for a demo purpose.
   * They should not be versioned.
   */

  angular.module('VideoApp.commons')
    .constant('VideoUpoaderConstants', {
      PASSWORD: 'a348406281a44a62c47d1a611c9e8802005a54e42f05fb1865b1d1e77bb9ec92',
      PROJECT_ID: 'xh6lyhls7l',
      URL: 'https://upload.wistia.com/',
      EMBED_URL: 'https://fast.wistia.net/embed/iframe/'
    });

})();

(function() {

  angular.module('VideoApp.commons')
  .provider('formatFileSizeFilter', function () {
    var $config = {
      // Byte units following the IEC format
      // http://en.wikipedia.org/wiki/Kilobyte
      units: [
        { size: 1000000000, suffix: ' GB' },
        { size: 1000000, suffix: ' MB' },
        { size: 1000, suffix: ' KB' }
      ]
    };

    this.defaults = $config;

    this.$get = function () {
      return function (bytes) {
        if (!angular.isNumber(bytes)) {
          return '';
        }
        var unit = true,
          i = 0,
          prefix,
          suffix;

        while (unit) {
          unit = $config.units[i];
          prefix = unit.prefix || '';
          suffix = unit.suffix || '';
          if (i === $config.units.length - 1 || bytes >= unit.size) {
            return prefix + (bytes / unit.size).toFixed(2) + suffix;
          }
          i += 1;
        }
      };
    };
  });

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW4vX21haW4uanMiLCJtYWluL21haW4uY29tcG9uZW50LmpzIiwicHJldmlldy9fcHJldmlldy5qcyIsInByZXZpZXcvcHJldmlldy5jb21wb25lbnQuanMiLCJ0ZW1wbGF0ZXMuanMiLCJ1cGxvYWRlci9fdXBsb2FkZXIuanMiLCJ1cGxvYWRlci91cGxvYWRlci5jb21wb25lbnQuanMiLCJfY29tbW9uLmpzIiwiY29tcG9uZW50cy92aWRlby11cGxvYWRlci92aWRlb1VwbG9hZGVyLmNvbXBvbmVudC5qcyIsImNvbnN0YW50cy92aWRlb1VwbG9hZGVyLmNvbnN0YW50LmpzIiwiZmlsdGVycy9maWx0ZXJzLmNvbnN0YW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO2lGQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ1ZpZGVvQXBwJywgW1xuICAgIC8vICogTGliczpcbiAgICAndWkuYm9vdHN0cmFwJyxcbiAgICAndWkucm91dGVyJyxcbiAgICAnbmdBbmltYXRlJyxcbiAgICAnbmdSZXNvdXJjZScsXG4gICAgLy8gJ2JsdWVpbXAuZmlsZXVwbG9hZCcsXG5cbiAgICAvLyAqIFRlbXBsYXRlIGNhY2hlIG1vZHVsZXM6XG4gICAgJ3RlbXBsYXRlcycsIC8vIGJhZyB3aXRoIGFsbCB0aGUgbW9kdWxlcyBodG1sIHRlbXBsYXRlc1xuXG4gICAgLy8gKiBDb21tb24gY29tcG9uZW50czpcbiAgICAnVmlkZW9BcHAuY29tbW9ucycsXG5cbiAgICAvLyAqIEFwcCBtb2R1bGVzOlxuICAgICdWaWRlb0FwcC5tYWluJyxcbiAgICAnVmlkZW9BcHAudXBsb2FkZXInLFxuICAgICdWaWRlb0FwcC5wcmV2aWV3J1xuICBdKVxuXG5cbiAgLypAbmdJbmplY3QqL1xuICAuY29uZmlnKFtcIiR1cmxSb3V0ZXJQcm92aWRlclwiLCBmdW5jdGlvbigkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvdXBsb2FkZXInKTtcbiAgfV0pXG5cblxuICAvKkBuZ0luamVjdCovXG4gIC5ydW4oW1wiJHJvb3RTY29wZVwiLCBcIiRzdGF0ZVwiLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUpIHtcblxuICAgIC8vIFdvcmthcm91bmQgdG8gdXNlIGFic3RyYWN0IHN0YXRlcyB3aXRoIGRlZmF1bHQgY2hpbGRyZW46XG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oZXZ0LCB0bywgcGFyYW1zKSB7XG4gICAgICBpZiAodG8ucmVkaXJlY3RUbykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJHN0YXRlLmdvKHRvLnJlZGlyZWN0VG8sIHBhcmFtcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfV0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICBhbmd1bGFyLm1vZHVsZSgnVmlkZW9BcHAubWFpbicsIFtdKVxuXG4gIC8qQG5nSW5qZWN0Ki9cbiAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCBmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21haW4nLCB7XG4gICAgICB1cmw6ICcnLFxuICAgICAgdGVtcGxhdGU6ICc8bWFpbj48L21haW4+JyxcbiAgICAgIHJlZGlyZWN0VG86ICdtYWluLnVwbG9hZGVyJyAvLyB3b3JrYXJvdW5kIHRvIHVzZSBhYnN0cmFjdCB3aXRoIGRlZmF1bHQgY2hpbGRyZW4uXG4gICAgfSk7XG5cbiAgfV0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gIC8qQG5nSW5qZWN0Ki9cbiAgZnVuY3Rpb24gTWFpbkNvbnRyb2xsZXIoKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gZnVuY3Rpb24oKSB7fTtcbiAgfVxuXG4gIGFuZ3VsYXIubW9kdWxlKCdWaWRlb0FwcC5tYWluJylcbiAgICAuY29tcG9uZW50KCdtYWluJywge1xuICAgICAgdGVtcGxhdGVVcmw6ICdtYWluL21haW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiBNYWluQ29udHJvbGxlclxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdWaWRlb0FwcC5wcmV2aWV3JywgW10pXG5cbiAgLypAbmdJbmplY3QqL1xuICAuY29uZmlnKFtcIiRzdGF0ZVByb3ZpZGVyXCIsIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgIC5zdGF0ZSgnbWFpbi5wcmV2aWV3Jywge1xuICAgICAgICB1cmw6ICcvcHJldmlldy86dmlkZW9JZCcsXG4gICAgICAgIHRlbXBsYXRlOiAnPHByZXZpZXc+PC9wcmV2aWV3PidcbiAgICAgIH0pO1xuICB9XSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgLypAbmdJbmplY3QqL1xuICBQcmV2aWV3Q3RybC4kaW5qZWN0ID0gW1wiJHN0YXRlUGFyYW1zXCIsIFwiJHNjZVwiLCBcIiRzdGF0ZVwiLCBcIlZpZGVvVXBvYWRlckNvbnN0YW50c1wiXTtcbiAgZnVuY3Rpb24gUHJldmlld0N0cmwoJHN0YXRlUGFyYW1zLCAkc2NlLCAkc3RhdGUsIFZpZGVvVXBvYWRlckNvbnN0YW50cykge1xuICAgIHZhciBjdHJsID0gdGhpcztcbiAgICBjdHJsLnZpZGVvVXJsID0gJyc7XG5cbiAgICBjdHJsLiRvbkluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2aWRlb0lkID0gJHN0YXRlUGFyYW1zLnZpZGVvSWQ7XG4gICAgICB2YXIgdXJsID0gVmlkZW9VcG9hZGVyQ29uc3RhbnRzLkVNQkVEX1VSTCArIHZpZGVvSWQ7XG5cbiAgICAgIGN0cmwudmlkZW9VcmwgPSAkc2NlLnRydXN0QXNSZXNvdXJjZVVybCh1cmwpO1xuICAgIH07XG5cbiAgICBjdHJsLmdvVG9VcGxvYWRQYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc3RhdGUuZ28oJ21haW4udXBsb2FkZXInKTtcbiAgICB9O1xuICB9XG5cbiAgYW5ndWxhci5tb2R1bGUoJ1ZpZGVvQXBwLnByZXZpZXcnKVxuICAgIC5jb21wb25lbnQoJ3ByZXZpZXcnLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJ3ByZXZpZXcvcHJldmlldy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6IFByZXZpZXdDdHJsXG4gICAgfSk7XG5cbn0pKCk7XG4iLG51bGwsIihmdW5jdGlvbigpIHtcbiAgYW5ndWxhci5tb2R1bGUoJ1ZpZGVvQXBwLnVwbG9hZGVyJywgW10pXG5cbiAgLypAbmdJbmplY3QqL1xuICAuY29uZmlnKFtcIiRzdGF0ZVByb3ZpZGVyXCIsIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgIC5zdGF0ZSgnbWFpbi51cGxvYWRlcicsIHtcbiAgICAgICAgdXJsOiAnL3VwbG9hZGVyJyxcbiAgICAgICAgdGVtcGxhdGU6ICc8dXBsb2FkZXI+PC91cGxvYWRlcj4nXG4gICAgICB9KTtcbiAgfV0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAvKkBuZ0luamVjdCovXG5cbiAgVXBsb2FkZXJDdHJsLiRpbmplY3QgPSBbXCIkc3RhdGVcIiwgXCIkc2NvcGVcIl07XG4gIGZ1bmN0aW9uIFVwbG9hZGVyQ3RybCgkc3RhdGUsICRzY29wZSkge1xuICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgIGN0cmwub25VcGxvYWQgPSBmdW5jdGlvbih2aWRlbykge1xuICAgICAgJHN0YXRlLmdvKCdtYWluLnByZXZpZXcnLCB7XG4gICAgICAgIHZpZGVvSWQ6IHZpZGVvLmhhc2hlZF9pZFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGN0cmwub25GYWlsID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGN0cmwuZXJyb3IgPSBlcnJvci5qcVhIUi5yZXNwb25zZUpTT04uZXJyb3I7XG4gICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgfTtcbiAgfVxuXG4gIGFuZ3VsYXIubW9kdWxlKCdWaWRlb0FwcC51cGxvYWRlcicpXG4gICAgLmNvbXBvbmVudCgndXBsb2FkZXInLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJ3VwbG9hZGVyL3VwbG9hZGVyLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogVXBsb2FkZXJDdHJsXG4gICAgfSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIFNldHVwIGZvciBjb21tb24gbW9kdWxlcy5cbiAqL1xuXG5hbmd1bGFyLm1vZHVsZSgnVmlkZW9BcHAuY29tbW9ucycsIFtdKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAvKkBuZ0luamVjdCovXG4gIFZpZGVvVXBsb2FkZXJDdHJsLiRpbmplY3QgPSBbXCIkZWxlbWVudFwiLCBcIiRzY29wZVwiLCBcIlZpZGVvVXBvYWRlckNvbnN0YW50c1wiXTtcbiAgZnVuY3Rpb24gVmlkZW9VcGxvYWRlckN0cmwoJGVsZW1lbnQsICRzY29wZSwgVmlkZW9VcG9hZGVyQ29uc3RhbnRzKSB7XG4gICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICBjdHJsLnByZXZpZXcgPSBudWxsO1xuICAgICAgY3RybC52aWRlbyA9IG51bGw7XG4gICAgICBjdHJsLnByb2dyZXNzID0gMDtcbiAgICAgIGN0cmwubG9hZGluZyA9IGZhbHNlO1xuICAgICAgY3RybC52aWRlb0Nob3NlbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGN0cmwuJG9uSW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGVsZW1lbnQuZmlsZXVwbG9hZCh7XG4gICAgICAgIHVybDogVmlkZW9VcG9hZGVyQ29uc3RhbnRzLlVSTCxcblxuICAgICAgICBmb3JtRGF0YToge1xuICAgICAgICAgIGFwaV9wYXNzd29yZDogVmlkZW9VcG9hZGVyQ29uc3RhbnRzLlBBU1NXT1JELFxuICAgICAgICAgIHByb2plY3RfaWQ6IFZpZGVvVXBvYWRlckNvbnN0YW50cy5QUk9KRUNUX0lELFxuICAgICAgICB9LFxuXG4gICAgICAgIG11bHRpcGFydDogdHJ1ZSxcblxuICAgICAgICBhY2NlcHRGaWxlVHlwZXM6IC8oXFwufFxcLykoYXZpfGFzZnxmbHZ8TVBHfE1QNHxXTVYpJC9pLFxuXG4gICAgICAgIGxvYWRWaWRlb0ZpbGVUeXBlczogLyhcXC58XFwvKShhdml8YXNmfGZsdnxNUEd8TVA0fFdNVikkL2ksXG5cbiAgICAgICAgbWF4RmlsZVNpemU6IGN0cmwubWF4RmlsZVNpemUgfHwgNTAwMDAwMCwgLy8gNU1iIGJ5IGRlZmF1bHRcblxuICAgICAgICBtYXhOdW1iZXJPZkZpbGVzOiAxLFxuXG4gICAgICAgIHByb2dyZXNzSW50ZXJ2YWw6IDUwMCxcblxuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGUsIGRhdGEpIHtcbiAgICAgICAgICBjdHJsLnZpZGVvID0gZGF0YS5vcmlnaW5hbEZpbGVzWzBdO1xuICAgICAgICAgIGN0cmwudmlkZW9DaG9zZW4gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgIGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChjdHJsLnZpZGVvKTtcbiAgICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGN0cmwudmlkZW8udXJsID0gZS50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJvZ3Jlc3NhbGw6IGZ1bmN0aW9uKGUsIGRhdGEpIHtcbiAgICAgICAgICBjdHJsLnByb2dyZXNzID0gcGFyc2VJbnQoZGF0YS5sb2FkZWQgLyBkYXRhLnRvdGFsICogMTAwLCAxMCk7XG4gICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRvbmU6IGZ1bmN0aW9uKGUsIGRhdGEpIHtcbiAgICAgICAgICBjdHJsLm9uVXBsb2FkKGRhdGEucmVzdWx0KTtcbiAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmYWlsOiBmdW5jdGlvbihlLCBkYXRhKSB7XG4gICAgICAgICAgY3RybC5vbkZhaWwoZGF0YS5yZXNwb25zZSgpKTtcbiAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJlc2V0KCk7XG4gICAgfTtcblxuICAgIGN0cmwudXBsb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY3RybC52aWRlbykge1xuICAgICAgICAkZWxlbWVudC5maWxldXBsb2FkKCdzZW5kJywge1xuICAgICAgICAgIGZpbGVzOiBbY3RybC52aWRlb11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY3RybC5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY3RybC4kb25EZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGVsZW1lbnQuZmlsZXVwbG9hZCgnZGVzdHJveScpO1xuICAgIH07XG4gIH1cblxuXG4gIGFuZ3VsYXIubW9kdWxlKCdWaWRlb0FwcC5jb21tb25zJylcbiAgICAuY29tcG9uZW50KCd2aWRlb1VwbG9hZGVyJywge1xuICAgICAgY29udHJvbGxlcjogVmlkZW9VcGxvYWRlckN0cmwsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvdmlkZW8tdXBsb2FkZXIvdmlkZW8tdXBsb2FkZXIuaHRtbCcsXG4gICAgICBiaW5kaW5nczoge1xuICAgICAgICBvblVwbG9hZDogJz0nLFxuICAgICAgICBvbkZhaWw6ICc9JyxcbiAgICAgICAgbWF4RmlsZVNpemU6ICdAJ1xuICAgICAgfVxuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAvKlxuICAgKiBUaGVzZSBjb25zdGFudHMgYXJlIGRlZmluZWQgaGVyZSBmb3IgYSBkZW1vIHB1cnBvc2UuXG4gICAqIFRoZXkgc2hvdWxkIG5vdCBiZSB2ZXJzaW9uZWQuXG4gICAqL1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdWaWRlb0FwcC5jb21tb25zJylcbiAgICAuY29uc3RhbnQoJ1ZpZGVvVXBvYWRlckNvbnN0YW50cycsIHtcbiAgICAgIFBBU1NXT1JEOiAnYTM0ODQwNjI4MWE0NGE2MmM0N2QxYTYxMWM5ZTg4MDIwMDVhNTRlNDJmMDVmYjE4NjViMWQxZTc3YmI5ZWM5MicsXG4gICAgICBQUk9KRUNUX0lEOiAneGg2bHlobHM3bCcsXG4gICAgICBVUkw6ICdodHRwczovL3VwbG9hZC53aXN0aWEuY29tLycsXG4gICAgICBFTUJFRF9VUkw6ICdodHRwczovL2Zhc3Qud2lzdGlhLm5ldC9lbWJlZC9pZnJhbWUvJ1xuICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdWaWRlb0FwcC5jb21tb25zJylcbiAgLnByb3ZpZGVyKCdmb3JtYXRGaWxlU2l6ZUZpbHRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGNvbmZpZyA9IHtcbiAgICAgIC8vIEJ5dGUgdW5pdHMgZm9sbG93aW5nIHRoZSBJRUMgZm9ybWF0XG4gICAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0tpbG9ieXRlXG4gICAgICB1bml0czogW1xuICAgICAgICB7IHNpemU6IDEwMDAwMDAwMDAsIHN1ZmZpeDogJyBHQicgfSxcbiAgICAgICAgeyBzaXplOiAxMDAwMDAwLCBzdWZmaXg6ICcgTUInIH0sXG4gICAgICAgIHsgc2l6ZTogMTAwMCwgc3VmZml4OiAnIEtCJyB9XG4gICAgICBdXG4gICAgfTtcblxuICAgIHRoaXMuZGVmYXVsdHMgPSAkY29uZmlnO1xuXG4gICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChieXRlcykge1xuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNOdW1iZXIoYnl0ZXMpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1bml0ID0gdHJ1ZSxcbiAgICAgICAgICBpID0gMCxcbiAgICAgICAgICBwcmVmaXgsXG4gICAgICAgICAgc3VmZml4O1xuXG4gICAgICAgIHdoaWxlICh1bml0KSB7XG4gICAgICAgICAgdW5pdCA9ICRjb25maWcudW5pdHNbaV07XG4gICAgICAgICAgcHJlZml4ID0gdW5pdC5wcmVmaXggfHwgJyc7XG4gICAgICAgICAgc3VmZml4ID0gdW5pdC5zdWZmaXggfHwgJyc7XG4gICAgICAgICAgaWYgKGkgPT09ICRjb25maWcudW5pdHMubGVuZ3RoIC0gMSB8fCBieXRlcyA+PSB1bml0LnNpemUpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyAoYnl0ZXMgLyB1bml0LnNpemUpLnRvRml4ZWQoMikgKyBzdWZmaXg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuICB9KTtcblxufSkoKTtcbiJdfQ==

'use strict';

const gulp = require('gulp');
const templateCache = require('gulp-angular-templatecache');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
// const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const merge = require('merge-stream');
const rimraf = require('rimraf');
const _ = require('lodash');
const less = require('gulp-less'); // less compiler.
const livereload = require('gulp-livereload');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const ngAnnotate = require('gulp-ng-annotate');

const serve = require('gulp-serve');

const VENDOR_PATH = 'vendor';

// General Config:
const config = {
  jsName: 'index',
  dist: 'dist',
  vendor: VENDOR_PATH,
  jsDist: 'dist/js',
  jsModulesDist: 'dist/js/modules',
  cssDist: 'dist/css',
  fontsDist: 'dist/fonts',
  jsModuleName: 'modules',
  serverPort: 8080,
  livereloadPort: 12345,

  src: {
    vendors: {
      css: [
        VENDOR_PATH + '/bootstrap/dist/css/bootstrap.min.css',
        VENDOR_PATH + '/blueimp-file-upload/css/jquery.fileupload-ui.css',
        VENDOR_PATH + '/blueimp-file-upload/css/jquery.fileupload.css'
      ],
      js: [
        VENDOR_PATH + '/jquery/dist/jquery.min.js',

        VENDOR_PATH + '/angular/angular.js',
        VENDOR_PATH + '/angular-ui-router/release/angular-ui-router.min.js',
        VENDOR_PATH + '/angular-resource/angular-resource.js',
        VENDOR_PATH + '/angular-animate/angular-animate.js',
        VENDOR_PATH + '/angular-bootstrap/ui-bootstrap-tpls.js',
        VENDOR_PATH + '/angular-resource/angular-resource.js',

        VENDOR_PATH + '/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
        VENDOR_PATH + '/blueimp-load-image/js/load-image.all.min.js',
        // VENDOR_PATH + '/blueimp-canvas-to-blob/js/canvas-to-blob.min.js',
        VENDOR_PATH + '/blueimp-file-upload/js/jquery.iframe-transport.js',

        // VENDOR_PATH + '/blueimp-file-upload/js/*.js',
        VENDOR_PATH + '/blueimp-file-upload/js/jquery.fileupload.js',

        VENDOR_PATH + '/blueimp-file-upload/js/jquery.fileupload-process.js',
        VENDOR_PATH + '/blueimp-file-upload/js/jquery.fileupload-video.js',
        // VENDOR_PATH + '/blueimp-file-upload/js/jquery.fileupload-angular.js',

        // VENDOR_PATH + '/blueimp-file-upload/js/jquery.fileupload-ui.js',
        // VENDOR_PATH + '/blueimp-file-upload/js/jquery.fileupload-audio.js',
        // VENDOR_PATH + '/blueimp-file-upload/js/jquery.fileupload-validate.js',

        // VENDOR_PATH + '/angular-mocks/angular-mocks.js'
      ]
    },
    app: {
      js: [
        'src/app/**/**.js',
        'src/commons/*.js',
        'src/commons/**/**.js'
      ],

      statics: [
        'src/assets/imgs/favicon.ico',
        'src/assets/imgs/favicon.png',
        'src/assets/humans.txt',
        'src/assets/robots.txt'
      ],

      styles: [
        './src/assets/styles/**/*.less',
        './src/app/**/*.less',
        './src/commons/**/*.less'
      ],

      tpls: [
        'src/app/**/*.html',
        'src/commons/**/*.html'
      ]
    }
  }
};




/***** Task: Build JS *****/
gulp.task('build-js', () => {
  let htmlMinOpts = {
    collapseWhitespace: true,
    conservativeCollapse: true
  };

  return merge(
      gulp.src(config.src.app.js)
        .pipe(ngAnnotate())
        .pipe(sourcemaps.init()),

      gulp.src(config.src.app.tpls)
          .pipe(htmlmin(htmlMinOpts))
          .pipe(templateCache({
            standalone: true,
            module: 'templates'
          }))
    )

    .pipe(concat(config.jsName + '.js'))

    .pipe(sourcemaps.write())

    .pipe(gulp.dest(config.jsDist));
});


/***** Task: Bootstrap Css *****/
gulp.task('vendors-css', () => {
  return gulp.src(config.src.vendors.css)
    .pipe(concat('vendors-styles.css'))
    .pipe(gulp.dest(config.cssDist));
});


/***** Task: Less to Build Css *****/
gulp.task('build-css', ['vendors-css'], () => {
  return gulp.src(config.src.app.styles)
    .pipe(less())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(config.cssDist));
});


/***** Task: Copy Static *****/
gulp.task('copy-static', () => {
  return merge(
    gulp.src('src/index.html')
        .pipe(gulp.dest(config.dist)),

    gulp.src(config.vendor + '/bootstrap/fonts/*')
        .pipe(gulp.dest(config.fontsDist)),

    gulp.src(['src/assets/**/*.*', '!src/assets/styles/*.*'])
        .pipe(gulp.dest(config.dist)),

    gulp.src(config.src.app.statics)
        .pipe(gulp.dest(config.dist)),

    gulp.src(config.src.vendors.js)
      .pipe(concat('vendors.js'))
      .pipe(gulp.dest(config.jsDist))
  );
});


/***** Task: Clean *****/
gulp.task('clean', (done) =>  {
  return rimraf(config.dist, done);
});


/***** Task: Lint *****/
gulp.task('lint', () => {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});


/***** Task: Watch *****/
gulp.task('watch', () => {
  livereload.listen();

  gulp.watch('src/**/*.js', ['lint', 'copy-static', 'build-js']);
  gulp.watch(['src/**/*.html'], ['copy-static', 'build-js']);

  gulp.watch(['src/assets/**/*.*', '!src/assets/less/*.less'], ['copy-static']);
  return gulp.watch(config.src.app.styles, [
      'build-css'
    ])
    .on('change', () => {
      livereload.changed('dist');
    });
});


/***** Task: Build *****/
gulp.task('build', (cbk) => {
  return runSequence('clean', [
    'copy-static',
    'lint',
    'build-js',
    'build-css',
    'watch'
  ],
  cbk);
});


/***** Task: Serve *****/
gulp.task('serve', ['build'], serve({
  root: [config.dist],
  port: config.serverPort
}));


/***** Task: Default *****/
gulp.task('default', [
  'serve'
]);

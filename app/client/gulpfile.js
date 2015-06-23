var gulp = require('gulp'),
    umd = require('gulp-umd'),
    watch = require('gulp-watch'),
    stylus = require('gulp-stylus'),
    eslint = require('gulp-eslint'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    config = {
      src: 'src',
      build: 'build',
      dist: 'dist',
      stylusSrc: 'src/app/css/app.styl',
      stylusWatchSrc: 'src/app/css/**/*.styl',
      stylusDest: 'build/app/css',
      copyBuildSrc: ['src/app/vendor/**/*.js', 'src/app/**/*.es5.*'],
      copyDistSrc: ['build/app/bootloader.es5.js', 'build/**/*.css', 'build/**/*.html'],
      lintSrc: ['src/app/js/**/*.js', 'src/app/lib/**/*.js'],
      browserSyncSrc: ['build/**/*.html', 'build/**/*.js', 'build/**/*.css']
    }

gulp.task('stylus', function () {
  return gulp.src(config.stylusSrc)
          .pipe(sourcemaps.init())
          .pipe(stylus({'include css': true}))
          .pipe(autoprefixer({browsers: ['last 2 versions']}))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.stylusDest))
})

gulp.task('stylus:watch', ['stylus'], function () {
  gulp.watch(config.stylusWatchSrc, ['stylus'])
})

gulp.task('copy-build', function () {
  return gulp.src(config.copyBuildSrc, {base: config.src})
          .pipe(gulp.dest(config.build))
})

gulp.task('copy-build:watch', ['copy-build'], function () {
  gulp.watch(config.copyBuildSrc, ['copy-build'])
})

gulp.task('copy-dist', function () {
  return gulp.src(config.copyDistSrc, {base: config.build})
          .pipe(gulp.dest(config.dist))
})

gulp.task('shim-babel-polyfill', function () {
  return gulp.src('src/app/vendor/babel-polyfill/browser-polyfill.js')
          .pipe(umd({
            exports: function () {return '_babelPolyfill'},
            namespace: function () {return 'window._babelPolyfill'}
          }))
          .pipe(gulp.dest('build/app/shim/babel-polyfill/'))
})

gulp.task('shim-html2canvas', function () {
  return gulp.src('src/app/vendor/html2canvas/dist/html2canvas.min.js')
          .pipe(umd({
            exports: function () {return 'html2canvas'},
            namespace: function () {return 'window.html2canvas'}
          }))
          .pipe(gulp.dest('build/app/shim/html2canvas/'))
})

gulp.task('shim-fetch', function () {
  return gulp.src('src/app/vendor/fetch/fetch.js')
          .pipe(umd({
            exports: function () {return 'fetch'},
            namespace: function () {return 'window.fetch'}
          }))
          .pipe(gulp.dest('build/app/shim/fetch/'))
})

gulp.task('shim', ['shim-babel-polyfill', 'shim-html2canvas', 'shim-fetch'])

gulp.task('lint', function () {
  return gulp.src(config.lintSrc)
          .pipe(eslint())
          .pipe(eslint.format())
})

gulp.task('lint:watch', function () {
  return gulp.src(config.lintSrc)
          .pipe(watch(config.lintSrc))
          .pipe(eslint())
          .pipe(eslint.formatEach())
})

gulp.task('browser-sync', function () {
  browserSync({
    server: config.build,
    port: process.env.PORT || 3000,
    files: config.browserSyncSrc,
    logFileChanges: false,
    ghostMode: false,
    reloadOnRestart: false,
    open: false,
    ui: false
  })
})

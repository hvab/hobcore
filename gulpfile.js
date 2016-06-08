'use strict';

const del = require('del');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const atImport = require('postcss-import');
const assets  = require('postcss-assets');
const csso = require('gulp-csso');
const gulpIf = require('gulp-if');
const flatten = require('gulp-flatten');
const imagemin = require('gulp-imagemin');
const rigger = require('gulp-rigger');
const nunjucks = require('gulp-nunjucks');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const notify = require("gulp-notify");
const size = require("gulp-size");
const debug = require('gulp-debug');
const ftp = require('vinyl-ftp');
const replace = require('gulp-replace');

// export PATH=./node_modules/.bin:$PATH
// export NODE_ENV=development
// NODE_ENV=production gulp
// NODE_ENV=production gulp deploy
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const processors = [
  atImport({
    path: [
      __dirname+'/libs',
      __dirname+'/lib'
    ]
  }),
  autoprefixer({
    browsers: [
      'Chrome >= 35',
      'Firefox >= 31',
      'Edge >= 12',
      'Explorer >= 9',
      'iOS >= 8',
      'Safari >= 8',
      'Android 2.3',
      'Android >= 4',
      'Opera >= 12'
    ]
  }),
  assets({
    loadPaths: ['dist/**'],
    relativeTo: 'dist/'
  })
];

gulp.task('styles', function() {
  return gulp.src('src/*.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass({
      includePaths: [
        __dirname+'/libs',
        __dirname+'/lib'
      ]
    }).on('error', notify.onError(function(err){
      return {
        title: 'Sass',
        message: err.message,
        sound: 'Blow'
      };
    })))
    .pipe(debug({title: 'sass:'}))
    .pipe(postcss(processors).on('error', notify.onError(function(err){
      return {
        title: 'PostCSS',
        message: err.message,
        sound: 'Blow'
      };
    })))
    .pipe(debug({title: 'postcss:'}))
    .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
    .pipe(gulpIf(!isDevelopment, csso()))
    .pipe(gulp.dest('dist'))
    .pipe(size());
});


gulp.task('images', function() {
  return gulp.src('src/**/*.+(png|jpg|jpeg|gif|bmp|svg)', {since: gulp.lastRun('images')})
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest('dist/images'))
    .pipe(size());
});


gulp.task('assets', function() {
  return gulp.src([
      'src/**/*.*',
      '!src/**/*.+(png|jpg|jpeg|gif|bmp|svg|js|html|css|scss)',
      '!src/{favicon.ico,robots.txt,sitemap.xml,*.json}'
    ], {since: gulp.lastRun('assets')})
    .pipe(flatten())
    .pipe(gulp.dest('dist/assets'))
    .pipe(size());
});


gulp.task('misc', function() {
  return gulp.src('src/{favicon.ico,robots.txt,sitemap.xml,*.json}', {since: gulp.lastRun('misc')})
    .pipe(gulp.dest('dist'))
    .pipe(size());
});


var date = new Date();
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(nunjucks.compile().on('error', notify.onError(function(err){
      return {
        title: 'Nunjucks',
        message: err.message,
        sound: 'Blow'
      };
    })))
    .pipe(gulpIf( !isDevelopment, replace('?rev=@@', '?rev='+date.getTime()) ))
    .pipe(gulp.dest('dist'))
    .pipe(size());
});


gulp.task('js', function() {
  return gulp.src('src/*.js')
  .pipe(replace('//= ~', '//= '+__dirname+'/libs'))
  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  .pipe(rigger())
  .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
  .pipe(gulpIf(!isDevelopment, uglify()))
  .pipe(gulp.dest('dist'))
  .pipe(size());
});


gulp.task('clean', function() {
  return del('dist/*');
});


gulp.task('ftp', function() {
  var conn = ftp.create( {
    host:     'site.url',
    user:     'username',
    password: 'password'
  });

  return gulp.src('dist/**', {buffer: false})
    .pipe(conn.newer('/www'))
    .pipe(conn.dest('/www'));
});


gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('images', 'assets', 'html', 'js', 'misc'),
  'styles' // 'styles' must be after 'assets'
));


gulp.task('watch', function() {
  gulp.watch(['src/**/*.+(scss|css)'], gulp.series('styles'));
  gulp.watch('src/**/*.+(png|jpg|jpeg|gif|bmp|svg|ico)', gulp.series('images'));
  gulp.watch([
    'src/**/*.*',
    '!src/**/*.+(png|jpg|jpeg|gif|bmp|svg|ico|js|html|css|scss)',
    '!src/{favicon.ico,robots.txt,sitemap.xml,*.json}'
  ], gulp.series('assets'));
  gulp.watch('src/**/*.html', gulp.series('html'));
  gulp.watch('src/**/*.js', gulp.series('js'));
  gulp.watch('src/{favicon.ico,robots.txt,sitemap.xml,*.json}', gulp.series('misc'));
});


gulp.task('serve', function() {
  browserSync.init({
    server: 'dist',
    port: isDevelopment ? 3000 : 8080,
    notify: false,
    open: false,
    ui: false,
    logPrefix: "hobcore",
    tunnel: false,
  });

  browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});


gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
gulp.task('prod', gulp.series('build', 'serve'));
gulp.task('deploy', gulp.series('build', 'ftp'));

gulp.task('default', gulp.series(isDevelopment ? 'dev' : 'prod'));

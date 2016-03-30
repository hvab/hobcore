'use strict';

const del = require('del');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const atImport = require('postcss-import');
const assets  = require('postcss-assets');
const cssnano = require('gulp-cssnano');
const gulpIf = require('gulp-if');
const flatten = require('gulp-flatten');
const imagemin = require('gulp-imagemin');
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// export PATH=./node_modules/.bin:$PATH
// export NODE_ENV=development
// NODE_ENV=production gulp build
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const processors = [
  atImport(),
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
    loadPaths: ['dist/images/', 'dist/assets/'],
    relativeTo: 'dist/'
  })
];

gulp.task('styles', function() {
  return gulp.src('src/*.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
    .pipe(gulpIf(!isDevelopment, cssnano({
      discardComments: { removeAll: true },
      autoprefixer: false, // мы уже делаем это выше
      colormin: false // чтобы не конвертировались rgba в hsla
    })))
    .pipe(gulp.dest('dist'));
});


gulp.task('images', function() {
  return gulp.src('src/**/*.+(png|jpg|jpeg|gif|bmp|svg)', {since: gulp.lastRun('images')})
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(gulp.dest('dist/images'));
});


gulp.task('assets', function() {
  return gulp.src([
      'src/**/*.*',
      '!src/**/*.+(png|jpg|jpeg|gif|bmp|svg|js|html|css|scss)',
      '!src/{favicon.ico,robots.txt,sitemap.xml,*.json}'
    ], {since: gulp.lastRun('assets')})
    .pipe(flatten())
    .pipe(gulp.dest('dist/assets'));
});


gulp.task('misc', function() {
  return gulp.src('src/{favicon.ico,robots.txt,sitemap.xml,*.json}', {since: gulp.lastRun('misc')})
    .pipe(gulp.dest('dist'));
});


gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('dist'));
});


gulp.task('js', function() {
  return gulp.src('src/*.js')
  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  .pipe(rigger())
  .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
  .pipe(gulpIf(!isDevelopment, uglify()))
  .pipe(gulp.dest('dist'))
});


gulp.task('clean', function() {
  return del('dist/*');
});


gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('images', 'assets', 'html', 'js', 'misc'),
  'styles' // Стили собираем в последнюю очередь и после сборки ассетов, так как gulp-assets надо искать пути в dist
));


gulp.task('watch', function() {
  gulp.watch(['src/**/*.+(scss|css)'], gulp.series('styles'));
  gulp.watch('src/**/*.+(png|jpg|jpeg|gif|bmp|svg|ico)', gulp.series('images'));
  gulp.watch(['src/**/*.*', '!src/**/*.+(png|jpg|jpeg|gif|bmp|svg|ico|js|html|css|scss)', '!src/{favicon.ico,robots.txt,sitemap.xml,*.json}'], gulp.series('assets'));
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
    //tunnel: true,
  });

  browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});


gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
gulp.task('prod', gulp.series('build', 'serve'));

gulp.task('default', gulp.series(isDevelopment ? 'dev' : 'prod'));

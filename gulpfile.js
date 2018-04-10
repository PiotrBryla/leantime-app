var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

var sourceFilesJS = [
    './node_modules/qrcode-generator/qrcode.js',
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/socket.io-client/dist/socket.io.js',
    './bower_components/semantic-ui-calendar/dist/calendar.min.js'];

var cssLibs = [
    'bower_components/semantic-ui-calendar/dist/calendar.min.css'
]

gulp.task('copyIMG', function(){
    return gulp.src('assets/img/*')
        .pipe(gulp.dest('./dest/img/'))
});

gulp.task('copyJS', function(){
  return gulp.src(sourceFilesJS)
     .pipe(gulp.dest('./dest/js/'));
});

gulp.task('copyCSS', function(){
  return gulp.src(cssLibs)
     .pipe(gulp.dest('./dest/css/'));
});

gulp.task('css', function(){
  return gulp.src('assets/less/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('dest/css'))
});

gulp.task('js', function(){
  return gulp.src('assets/js/*.js')
    .pipe(gulp.dest('dest/js'))
});

gulp.task('default', ['css', 'js', 'copyJS', 'copyCSS','copyIMG' ]);

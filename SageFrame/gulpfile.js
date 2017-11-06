var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

var config = {
    scssPath : './Templates/TemplateName/scss',
    dest : './Templates/TemplateName'
};

gulp.task('sass', function() {
    var onError = function(err) {
        notify.onError({
            title: "Gulp Sass",
            subtitle: "Failure",
            message: "<%= error.message %>",
            sound: "Beep"
        })(err);
        this.emit('end');
    };
    return gulp.src(config.scssPath + '*.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(plumber.stop())
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dest + 'css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(config.dest + 'css'))
});
gulp.task('watch', function() {
    gulp.watch(config.scssPath + '**/*.scss', ['sass']);
});
gulp.task('default', ['sass', 'watch']);
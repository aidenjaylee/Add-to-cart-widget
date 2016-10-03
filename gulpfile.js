var gulp = require('gulp'),
  less = require('gulp-less'),
  minifyCss = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps');
  browserSync = require('browser-sync');

var reload = browserSync.reload;

gulp.task('less', function () {
  gulp.src('less/style.less')
    .pipe(sourcemaps.init()) //Set to embed source map back to the original file here
    .pipe(less())
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(sourcemaps.write('./maps', {debug: true}))
    .pipe(gulp.dest('css/'))
    .pipe(reload({stream:true}));
});

gulp.task('default', ['less']);

gulp.task('serve', ['less'], function () {

   var files = [
      '*/**/*.html',
      'js/*.js',
      'css/*.css'
   ];

   browserSync.init(files, {
      server: {
        baseDir: ['./']
      }
   });

    gulp.watch('less/**/*.less', ['less']);

});


gulp.task('watch', function () {

    gulp.watch('less/**/*.less', ['less']);

});

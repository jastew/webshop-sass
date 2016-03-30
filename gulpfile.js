var argv        = require('yargs').argv;
var browserSync = require('browser-sync');
var gulp        = require('gulp');
var jade        = require('gulp-jade');
var sass        = require('gulp-sass');

var options = {};


// Check for flags such as site key to be compiled
gulp.task('init', function() {

  // Set the site key
  if (argv.s) {
    options.root = './app/sites/' + argv.s;
  } else {
    options.root = './app/core';
  }
});


// Compile jade files into html
gulp.task('templates', function() {

  return gulp.src(options.root + '/**/*.jade')
    .pipe(jade({
      pretty: false,
    }))
    .pipe(gulp.dest(options.root + '/'))
});


// Watch for jade changes
gulp.task('jade-watch', ['templates'], browserSync.reload);


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: options.root,
  });

  // watch for core changes
  gulp.watch('./app/core/scss/**/*.scss', ['sass']);
  gulp.watch(options.root + '/scss/**/*.scss', ['sass']);
  gulp.watch(options.root + '/**/*.html').on('change', browserSync.reload);
});


// Compile sass into required directory
gulp.task('sass', function() {

  return gulp.src(options.root + '/scss/main.scss')
    .pipe(sass({
      includePaths: [
        './app/core/scss'
      ]
    }).on('error', sass.logError))
    .pipe(gulp.dest(options.root + "/css"))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('default', ['init', 'sass', 'templates'], function () {

  browserSync({server: options.root});

  gulp.watch('./app/core/scss/**/*.scss', ['sass']);
  gulp.watch(options.root + '/scss/**/*.scss', ['sass']);

  gulp.watch('./app/core/**/*.jade', ['jade-watch']);
  gulp.watch(options.root + '/**/*.jade', ['jade-watch']);
});

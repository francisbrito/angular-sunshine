'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    babelify = require('babelify'),
    sourcemap = require('gulp-sourcemaps'),
    browserify = require('browserify');

gulp.task('default', ['watch-www', 'watch-src', 'watch-styles', 'build',  'serve'], function () {});

gulp.task('build', ['build-sass', 'build-es6'], function () {});

gulp.task('build-sass', function () {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./public/styles/'));
});

gulp.task('build-es6', function () {
    return browserify({debug: true})
        .transform(babelify)
        .require('./src/scripts/bootstrap.js', {entry: true})
        .bundle()
        .on('error', function (err) {
            gutil.log('Browserify error.', err);
        })
        .pipe(plumber())
        .pipe(source('bootstrap.js'))
        .pipe(buffer())
        .pipe(sourcemap.init({loadMaps: true}))
        .pipe(sourcemap.write('./'))
        .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('serve', function () {
    return connect.server({
        root: './public',
        port: 3000,
        livereload: true
    });
});

gulp.task('watch-src', function () {
    return gulp.watch('./src/**/*.js', ['build-es6']);
});

gulp.task('watch-www', function () {
    return gulp.watch('./public/**/*.{js,html,css}', ['livereload']);
});

gulp.task('watch-styles', function () {
    return gulp.watch('./src/styles/**/*.scss', ['build-sass']);
});

gulp.task('livereload', function () {
    return gulp.src('./public/**/*.{js,html,css}')
        .pipe(connect.reload());
});

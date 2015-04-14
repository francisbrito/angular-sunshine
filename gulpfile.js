'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    babelify = require('babelify'),
    sourcemap = require('gulp-sourcemaps'),
    browserify = require('browserify');

gulp.task('default', ['watch-www', 'watch-src', 'watch-styles', 'build', 'serve'], function () {});

gulp.task('build', ['build-sass', 'build-es6'], function () {});

gulp.task('build-sass', function () {
    return gulp.src('./styles/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./public/styles/'));
});

gulp.task('build-es6', function () {
    return browserify({debug: true})
        .transform(babelify)
        .require('./src/index.js', {entry: true})
        .bundle()
        .pipe(plumber())
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemap.init({loadMaps: true}))
        .pipe(sourcemap.write('./'))
        .pipe(gulp.dest('./public/js/'));
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
    return gulp.watch('./styles/**/*.scss', ['build-sass']);
});

gulp.task('livereload', function () {
    return gulp.src('./public/**/*.{js,html}')
        .pipe(connect.reload());
});

'use strict';

// Main dependencies and plugins
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var csswring = require('csswring');
var postcss = require('gulp-postcss');
var watchify = require('watchify');
var babel = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

var src = './public/src/';
var dist = './public/dist/';
var appFile = 'app.js';
var lessFiles = src + 'less/**/*.less';

function compile( watch ) {
	var bundler = browserify( src + 'js/' + appFile, { debug: true }).transform(babel);
	if (watch) {
		bundler = watchify(bundler);
	}

	function rebundle() {
		bundler.bundle()
			.on('error', function(err) { console.error(err); this.emit('end'); })
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(gulp.dest( dist + 'js/' ))
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(streamify( uglify() ))
			.pipe(rename({suffix: '.min'}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest( dist + 'js/' ));
	}

	if (watch) {
		bundler.on('update', function() {
			console.log('-> bundling...');
			rebundle();
		});
	}

	rebundle();
}

gulp.task('less', function () {
	return gulp.src( lessFiles )
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(postcss([csswring]))
		.pipe(rename(function (path) {
			if (path.extname === '.map') {
				path.basename = path.basename.replace('.css', '.min.css');
			}
			if (path.extname === '.css') {
				path.basename += '.min';
			}
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest( dist + 'css'));
});

gulp.task('compile', function() {
	return compile();
});

gulp.task('watch', function() {
	gulp.watch( lessFiles, ['less'] );
	return compile(true);
});

gulp.task('build', ['less', 'compile'] );
gulp.task('default', ['build', 'watch'] );

'use strict';

// Main dependencies and plugins
var babel = require( 'babelify' );
var browserify = require( 'browserify' );
var csswring = require( 'csswring' );
var gulp = require( 'gulp' );
var less = require( 'gulp-less' );
var nodemon = require( 'gulp-nodemon' );
var postcss = require( 'gulp-postcss' );
var rename = require( 'gulp-rename' );
var source = require( 'vinyl-source-stream' );
var sourcemaps = require( 'gulp-sourcemaps' );
var streamify = require( 'gulp-streamify' );
var uglify = require( 'gulp-uglify' );
var buffer = require( 'vinyl-buffer' );

var src = './public/src/';
var dist = './public/dist/';
var appFile = 'app.js';
var lessFiles = src + 'less/**/*.less';

gulp.task( 'compile', function () {
	var bundler = browserify( src + 'js/' + appFile, { debug: true } ).transform( babel );

	bundler.bundle()
		.on( 'error', function ( err ) {
			console.error( err );
			this.emit( 'end' );
		} )
		.pipe( source( 'app.js' ) )
		.pipe( buffer() )
		.pipe( gulp.dest( dist + 'js/' ) )
		.pipe( sourcemaps.init( { loadMaps: true } ) )
		.pipe( streamify( uglify() ) )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( dist + 'js/' ) );
} );

gulp.task( 'less', function () {
	return gulp.src( lessFiles )
		.pipe( sourcemaps.init() )
		.pipe( less() )
		.pipe( postcss( [ csswring ] ) )
		.pipe( rename( function ( path ) {
			if ( path.extname === '.map' ) {
				path.basename = path.basename.replace( '.css', '.min.css' );
			}
			if ( path.extname === '.css' ) {
				path.basename += '.min';
			}
		} ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( dist + 'css' ) );
} );

gulp.task( 'watchLess', function () {
	gulp.watch( lessFiles, [ 'less' ] );
} );

gulp.task( 'start', function () {
	nodemon( {
		ignore: "public/dist/*",
		ext: 'html js',
		script: 'server.js',
		tasks: [ 'compile' ]
	} )
} );

gulp.task( 'build', [ 'less', 'compile' ] );
gulp.task( 'serve', [ 'build', 'start' ] );
gulp.task( 'default', [ 'watchLess', 'serve' ] );

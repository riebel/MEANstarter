var angular = require( 'angular' );
var ngRoute = require( 'angular-route' );
var appRoutes = require( './appRoutes' );
var HomeCtrl = require( './controllers/HomeCtrl' );
var SubpageCtrl = require( './controllers/SubpageCtrl' );
var UserService = require( './services/UserService' );

angular.module( 'sampleApp', [ 'ngRoute', 'appRoutes', 'HomeCtrl', 'SubpageCtrl', 'UserService' ] );
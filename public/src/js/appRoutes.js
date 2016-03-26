angular.module( 'appRoutes', [] ).config( [ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {

	$routeProvider

	// home page
		.when( '/', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		} )

		// subpage that will use the SubpageController
		.when( '/subpage', {
			templateUrl: 'views/subpage.html',
			controller: 'SubpageController'
		} );

	$locationProvider.html5Mode( true );

}]);
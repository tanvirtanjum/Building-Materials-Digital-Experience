app.controller('nav.controller', function ($scope, $http, $location, $routeParams, $rootScope, $window, $cookies, AppService) {
    $scope.isActive = function(viewLocation) {
        var currentPath = $location.path();
        
        // On a hard reload, the path might briefly be empty or '/'
        if (currentPath === '' || currentPath === '/') {
            return viewLocation === '/home'; // Force 'Home' to be the only active one
        }
        
        // Otherwise, strictly match the path
        return currentPath === viewLocation;
    };
});
app.controller('title.controller', function ($scope, $http, $location, $routeParams, $rootScope, $window, $cookies, AppService) {
    $scope.setTitle = function(title) {
        document.title = title;
    }

    $scope.GenerateTitle = function() {
        setTimeout(function(){
            console.log("Current Path:", $location.$$path);
            if($location.$$path == '/'){
                $scope.setTitle(AppService.TITLE);
            }
        
            else if($location.$$path == '/home'){
                newTitle = `Home | ${AppService.TITLE}`;
                $scope.setTitle(newTitle);
            }

            else if($location.$$path == '/products'){
                newTitle= `Products | ${AppService.TITLE}`;
                $scope.setTitle(newTitle);
            }

            else{
                newTitle = `404 Not Found | ${AppService.TITLE}`;
                $scope.setTitle(newTitle);
            }
        }, 100);
    };
});
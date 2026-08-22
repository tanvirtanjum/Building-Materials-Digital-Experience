var app = angular.module('app', ['ngRoute', 'ngCookies', 'ngFileUpload']);

app.service('AppService', function() {
    this.API_BASE_URL = 'http://localhost:3000/api/';
    this.TITLE = "X Digital Experience";
});


app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        redirectTo: '/home'
    });

    $routeProvider.when('/home', {
        templateUrl: '/views/home.html',
        controller: 'home.controller'
    });

    $routeProvider.when('/products', {
        templateUrl: '/views/products.html',
        controller: 'products.controller'
    });

    $routeProvider.when('/contact', {
        templateUrl: '/views/contact.html',
        controller: 'contact.controller'
    });

    $routeProvider.otherwise({ 
        redirectTo: '/' 
    });
});
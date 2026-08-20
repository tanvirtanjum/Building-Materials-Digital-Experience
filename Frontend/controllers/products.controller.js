app.controller('products.controller', function ($scope, $http, $location, $routeParams, $rootScope, $window, $cookies, AppService) {
    
    // Initial state attached to $scope
    $scope.products = [];
    $scope.loading = true;
    $scope.error = null;

    // Function to fetch data
    $scope.loadProducts = function() {
        $scope.loading = true;
        $scope.error = null;

        // Note: You can later move this $http call into your AppService!
        $http.get(AppService.API_BASE_URL + 'products')
            .then(function(response) {
                // Success
                $scope.products = response.data;
                $scope.loading = false;
            })
            .catch(function(error) {
                // Error
                console.error("API Error:", error);
                $scope.error = "Failed to load products. Is the backend running?";
                $scope.loading = false;
            });
    };

    // Trigger the fetch when the controller loads
    $scope.loadProducts();

    $scope.selectedProduct = null;
    $scope.detailsLoading = false;

    // Function to handle the modal opening
    $scope.openDetails = function(product) {
        // Set the base product info immediately so the modal has a title/image
        $scope.selectedProduct = angular.copy(product);
        $scope.detailsLoading = true;

        // Fetch the extra relational data (Variants, Attributes, Documents)
        var detailsUrl = AppService.API_BASE_URL + 'products/get/' + product.id;
        
        $http.get(detailsUrl)
            .then(function(response) {
                // Append the fetched data to our selectedProduct object
                $scope.selectedProduct.variants = response.data.variants;
                $scope.selectedProduct.attributes = response.data.attributes;
                $scope.selectedProduct.documents = response.data.documents;
                // NEW: Attach the hierarchical categories
                $scope.selectedProduct.hierarchicalCategories = response.data.hierarchicalCategories;
        
                $scope.detailsLoading = false;
            })
            .catch(function(error) {
                console.error("Failed to fetch product details:", error);
                $scope.detailsLoading = false;
            });
    };
});
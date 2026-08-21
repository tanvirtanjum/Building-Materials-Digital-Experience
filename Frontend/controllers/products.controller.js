app.controller('products.controller', function ($scope, $http) {
    
    // Core State
    $scope.products = [];
    $scope.loading = true;
    $scope.error = null;
    
    // Filter & Sort Models
    $scope.searchFilter = {}; 
    $scope.uniqueCategories = [];
    $scope.uniqueBrands = [];
    $scope.sortOption = 'name'; 
    $scope.selectedCategories = {}; 

    // Pagination Models
    $scope.currentPage = 1;
    $scope.pageSize = 6; 
    $scope.Math = window.Math; 

    // Safely handle page changes
    $scope.changePage = function(step) {
        $scope.currentPage += step;
    };

    // FIX ADDED: Safely reset to page 1 from inside child scopes (ng-repeat)
    $scope.resetPage = function() {
        $scope.currentPage = 1;
    };

    // Modal State (Grouped into an object to prevent scope issues)
    $scope.modalState = {
        selectedProduct: null,
        loading: false
    };

    // Load Catalog
    $scope.loadProducts = function() {
        $scope.loading = true;
        $http.get('http://localhost:3000/api/products')
            .then(function(response) {
                $scope.products = response.data;
                $scope.loading = false;
                
                var allCategories = new Set();
                var allBrands = new Set();

                response.data.forEach(function(p) {
                    if (p.brand_division) allBrands.add(p.brand_division);
                    if (p.categories) {
                        var cats = p.categories.split(', ');
                        cats.forEach(c => allCategories.add(c));
                    }
                });

                $scope.uniqueBrands = Array.from(allBrands).sort();
                $scope.uniqueCategories = Array.from(allCategories).sort();
            })
            .catch(function(error) {
                $scope.error = "Failed to load products. Is your Node.js backend running?";
                $scope.loading = false;
                console.error("API Error:", error);
            });
    };

    // Custom Filter for Multiple Checkbox Categories
    $scope.categoryFilter = function(product) {
        var activeCategories = Object.keys($scope.selectedCategories).filter(k => $scope.selectedCategories[k]);
        
        if (activeCategories.length === 0) return true;
        if (!product.categories) return false;
        
        return activeCategories.some(activeCat => product.categories.includes(activeCat));
    };

    // Helper to count how many categories are currently checked
    $scope.getSelectedCategoryCount = function() {
        return Object.keys($scope.selectedCategories).filter(k => $scope.selectedCategories[k]).length;
    };

    // Check if any filters are currently active
    $scope.hasActiveFilters = function() {
        return (
            ($scope.searchFilter.$ && $scope.searchFilter.$.length > 0) || 
            ($scope.searchFilter.brand_division && $scope.searchFilter.brand_division.length > 0) || 
            $scope.sortOption !== 'name' || 
            $scope.getSelectedCategoryCount() > 0
        );
    };

    // Clear All Filters
    $scope.clearFilters = function() {
        $scope.searchFilter = {};
        $scope.sortOption = 'name';
        $scope.selectedCategories = {};
        $scope.currentPage = 1; 
    };

    // Open Product Details Modal
    $scope.openDetails = function(product) {
        $scope.modalState.selectedProduct = product;
        $scope.modalState.loading = true;
        
        // Safety check: uses product_id if it exists, otherwise falls back to id
        var productId = product.product_id || product.id;
        
        $http.get('http://localhost:3000/api/products/get/' + productId)
            .then(function(response) {
                $scope.modalState.selectedProduct = response.data;
                $scope.modalState.loading = false;

                console.log("Loaded product details:", response.data);
            })
            .catch(function(error) {
                console.error("Failed to load details", error);
                $scope.modalState.loading = false;
            });
    };

    // Initialize the page by loading products
    $scope.loadProducts();
});
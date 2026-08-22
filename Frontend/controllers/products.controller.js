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

    // Safely reset to page 1 from inside child scopes (ng-repeat)
    $scope.resetPage = function() {
        $scope.currentPage = 1;
    };

    // Modal State
    $scope.modalState = {
        selectedProduct: null,
        loading: false
    };

    // --- 1. NEW: Fetch Filters from Backend APIs ---
    $scope.loadFilters = function() {
        // Fetch Brands (Adjust the URL if your router uses a different path, e.g., '/api/brands')
        $http.get('http://localhost:3000/api/products/get/brands')
            .then(function(response) {
                // Backend already sends an array of strings: ['Brand A', 'Brand B']
                $scope.uniqueBrands = response.data;
            })
            .catch(function(error) {
                console.error("Failed to load brands:", error);
            });

        // Fetch Categories (Adjust the URL if your router uses a different path)
        $http.get('http://localhost:3000/api/categories')
            .then(function(response) {
                // Backend sends objects: [{id: 1, name: 'Drywall', ...}, ...]
                // We map them to get an array of just the names for the checkboxes
                var catNames = response.data.map(function(c) { return c.name; });
                
                // Use a Set just to ensure no duplicates if your DB had any weird data
                $scope.uniqueCategories = Array.from(new Set(catNames)).sort();
            })
            .catch(function(error) {
                console.error("Failed to load categories:", error);
            });
    };

    // --- 2. UPDATED: Load Catalog ---
    $scope.loadProducts = function() {
        $scope.loading = true;
        
        $http.get('http://localhost:3000/api/products')
            .then(function(response) {
                $scope.products = response.data;
                $scope.loading = false;
                
                // NO MORE Set() EXTRACTIONS HERE! The frontend is now clean and fast.
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
        
        var productId = product.product_id || product.id;
        
        $http.get('http://localhost:3000/api/products/get/' + productId)
            .then(function(response) {
                $scope.modalState.selectedProduct = response.data;
                $scope.modalState.loading = false;
            })
            .catch(function(error) {
                console.error("Failed to load details", error);
                $scope.modalState.loading = false;
            });
    };

    // --- 3. Initialize the page ---
    $scope.loadFilters(); // Fetch the dropdown data
    $scope.loadProducts(); // Fetch the product grid data
});
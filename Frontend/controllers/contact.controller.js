app.controller('contact.controller', function ($scope, $timeout) {
    
    // Form Model
    $scope.contactData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    // UI State
    $scope.status = {
        submitting: false,
        success: false,
        error: false
    };

    // Handle Form Submission
    $scope.submitForm = function(isValid) {
        if (!isValid) return;

        $scope.status.submitting = true;
        $scope.status.error = false;
        $scope.status.success = false;

        // Simulate an API call with a 1.5 second delay
        $timeout(function() {
            // Here you would normally use $http.post('/api/contact', $scope.contactData)
            console.log("Form submitted with data:", $scope.contactData);
            
            $scope.status.submitting = false;
            $scope.status.success = true;
            
            // Reset the form
            $scope.contactData = {};
            // Optional: reset form validation state if you named your form 'contactForm'
            if ($scope.contactForm) {
                $scope.contactForm.$setPristine();
                $scope.contactForm.$setUntouched();
            }
        }, 1500);
    };
});
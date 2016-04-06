
/* Setup general page controller */
MetronicApp.controller('GeneralPageController', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	Metronic.initAjax();
    });
}]);

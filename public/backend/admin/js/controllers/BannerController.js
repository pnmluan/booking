angular.module('MetronicApp').controller('BannerController', function($rootScope, $scope, $http, $timeout, ngDialog) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;


    $scope.clickToAddNew = function() {
    	ngDialog.open({ 
    		width: '80%',
    		template: 'views/banner/model_add_banner.html', 
    		className: 'ngdialog-theme-default',
    		controller: ['$scope', function($scope){
    		 	
    		}]
    	});
    }
});
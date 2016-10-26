angular.module('MetronicApp').controller('CommentController', function($rootScope, $scope, $http, $timeout, CommentService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    CommentService.getComment().then(function(res) {
    	console.log(res);
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
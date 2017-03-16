angular.module('MetronicApp').controller('AuthController', function($rootScope, $scope, $window, $state, $http, $base64, $timeout, $location, $q, AuthService, ngDialog, toastr) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
        // toastr.info('We are open today from 10 to 22', 'Information');
    });

    mine = $scope;
    initialize();

    $scope.classNameStatus = function(status) {
        switch(status) {
            case 'active':
                return 'label label-sm label-success';
            case 'inactive':
                return 'label label-sm label-danger';
        }
    };

    $scope.onLogin = function() {
        AuthService.login($scope.mItem).then(function(res) {
            console.log(res.data.data.token)
            if(res.status == 200) {
                $rootScope.settings.token = res.data.data.token;
                localStorage.setItem('token', res.data.data.token);
                $scope.has_error = false;
                $window.location.href = $rootScope.settings.baseUrl + 'banner.html';
                $window.location.reload();
            }
        }, function(res) {
            if(res.status != 200) {
                $scope.has_error = true;
            }
        });
    }

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = false;
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.settings.state = $state.current.name;

    function initialize() {
        $scope.mItem = {};
        $scope.has_error = false;

    }

    function loadListItem() {
        // BannerService.getBanners().then(function(res) {

        //     if(res.statusText == 'OK') {
        //         $scope.listItem = res.data.data;
        //         return $scope.listItem;
        //     }
        //     return;
            
        // });
    }
});

angular.module('MetronicApp').controller('CommentController', function($rootScope, $scope, $http, $timeout, CommentService, ngDialog) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
    });

    $scope.data = {};

    CommentService.getComments().then(function(res) {
        $scope.data.comments = res.data;
    });

    $scope.classNameStatus = function(status) {
        switch(status) {
            case 'active':
                return 'label label-sm label-success';
            case 'inactive':
                return 'label label-sm label-danger';
        }
    };

    $scope.clickToAddNew = function() {
        ngDialog.openConfirm({
            template: 'views/banner/comment_new.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', function($scope){
                $scope.createComment = function() {
                    if ($scope.new_comment) {
                        CommentService.createComment($scope.new_comment).then(function(res) {
                            CommentService.getComments().then(function(res) {
                                $scope.data.comments = res.data;
                                ngDialog.close();
                            });
                        });
                    }
                }
            }]
        });
    };

    $scope.clickToUpdate = function(comment) {
        $scope.edit_comment = JSON.parse(JSON.stringify(comment));
        ngDialog.openConfirm({
            template: 'views/banner/comment_update.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', function($scope){
                $scope.updateComment = function() {
                    CommentService.updateComment($scope.edit_comment).then(function(res) {
                        CommentService.getComments().then(function(res) {
                            $scope.data.comments = res.data;
                            ngDialog.close();
                        });
                    });
                }
            }]
        });
    }

    $scope.clickToDelete = function(id) {
        ngDialog.openConfirm({
            template: 'views/banner/comment_delete.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', function($scope){
                $scope.deleteComment = function() {
                    CommentService.deleteComment(id).then(function(res) {
                        CommentService.getComments().then(function(res) {
                            $scope.data.comments = res.data;
                            ngDialog.close();
                        });
                    });
                }
            }]
        });
    };

    $scope.closeDialog = function() {
        ngDialog.close();
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
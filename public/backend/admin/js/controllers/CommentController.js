angular.module('MetronicApp').controller('CommentController', function($rootScope, $scope, $http, $base64, $timeout, CommentService, ngDialog, toastr, DTOptionsBuilder, DTColumnBuilder) {
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

    // Click to Add New
    $scope.clickToAddNew = function() {

        ngDialog.openConfirm({
            template: 'views/comment/model_add_comment.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', 'data', function($scope, data){
                $scope.mItem = {};
                $scope.errorMsg = [];

                $scope.optionStatus = data.optionStatus;
                $scope.optionStatus.selected = data.optionStatus[0];

                // Create Comment
                $scope.save = function() {
                    $scope.mItem.status = $scope.optionStatus.selected.id;
                    CommentService.createComment($scope.mItem).then(function(res) {

                        if(res.data.status == 'success') {
                            data.listItem.push(res.data.data);
                            $scope.mItem = {};
                            toastr.success('Added an item', 'Success');
                        } else {
                            $scope.errorMsg = res.data.error;
                            
                        }

                    });
                }

                // Close popup comment
                $scope.close = function() {
                    ngDialog.close();
                }
            }],
            resolve: {
                data: function () {
                    var data = {
                        optionStatus: $scope.optionStatus,
                        listItem: $scope.listItem
                    }
                    return data;
                }
            }
        });
    };

    // Click to Update
    $scope.clickToUpdate = function(comment) {
        $scope.edit_comment = JSON.parse(JSON.stringify(comment));
        ngDialog.openConfirm({
            template: 'views/comment/model_update_comment.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', '$filter', 'data', function($scope, $filter, data){
                $scope.mItem = comment;
                $scope.errorMsg = [];

                $scope.optionStatus = data.optionStatus;
                $scope.optionStatus.selected = $filter('filter')(data.optionStatus, {id: comment.status});
                console.log($scope.optionStatus.selected);

                // Create Comment
                $scope.save = function() {
                    $scope.mItem.status = $scope.optionStatus.selected.id;
                    CommentService.updateComment($scope.mItem).then(function(res) {

                        if(res.data.status == 'success') {
                            ngDialog.close();
                            toastr.success('Updated an item', 'Success');
                        } else {
                            $scope.errorMsg = res.data.error;
                            
                        }

                    });
                }

                // Close popup comment
                $scope.close = function() {
                    ngDialog.close();
                }

            }],
            resolve: {
                data: function () {
                    var data = {
                        optionStatus: $scope.optionStatus,
                        listItem: $scope.listItem
                    }
                    return data;
                }
            }
        });
    }

    $scope.clickToDelete = function(id) {
        swal({
          title: 'Are you sure?',
          text: "",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false
        }).then(function() {

            CommentService.deleteComment(id).then(function(res) {
                if(res.data.status == 'success') {
                    toastr.success('Deleted an item', 'Success');
                    loadListItem();
                }
            });
        }, function(dismiss) {});

    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    function initialize() {
        $scope.optionStatus = [
            {id: 'active', name: 'Active'},
            {id: 'inactive', name: 'Inactive'},
        ];
        
        $scope.listItem = [];
        loadListItem();

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('ajax', {
             // Either you specify the AjaxDataProp here
             // dataSrc: 'data',
            // headers: {'Authorization': "datvesieure:balobooking"},
            url: $rootScope.settings.apiPath + 'comment/index',
            type: 'GET',
            // beforeSend: function (xhr) {
            //     xhr.setRequestHeader('Authorization', "datvesieure:balobooking");
            // },
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization",
                "Basic " + btoa('datvesieure' + ":" + 'balobooking'));
            },
         })
         // or here
         .withDataProp('data')
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withPaginationType('full_numbers');
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('full_name').withTitle('Fullname'),
            DTColumnBuilder.newColumn('content').withTitle('Content'),
            DTColumnBuilder.newColumn('status').withTitle('Status'),
        ];
        
    
    }

    function loadListItem() {
        CommentService.getComments().then(function(res) {
            $scope.listItem = res.data.data;
        });
    }
});

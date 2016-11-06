angular.module('MetronicApp').controller('LocationController', function($rootScope, $scope, $http,  $base64, $timeout, LocationService, ngDialog, toastr, DTOptionsBuilder, DTColumnBuilder) {
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
            template: 'views/location/model_add_location.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', 'data', function($scope, data){
                $scope.mItem = {};
                $scope.errorMsg = [];

                $scope.optionStatus = data.optionStatus;
                $scope.optionStatus.selected = data.optionStatus[0];

                // Create Location
                $scope.save = function() {
                    $scope.mItem.status = $scope.optionStatus.selected.id;
                    LocationService.createLocation($scope.mItem).then(function(res) {

                        if(res.data.status == 'success') {
                            data.listItem.push(res.data.data);
                            $scope.mItem = {};
                            toastr.success('Added an item', 'Success');
                        } else {
                            $scope.errorMsg = res.data.error;
                            
                        }

                    });
                }

                // Close popup Location
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

    function getItemByID(id) {
        var item = {};
        angular.forEach($scope.listItem, function(row, key) {
            if(row.id == id) {
                item = row;
                return;
            }
        });
        return item;
    }

    // Click to Update
    $('#dataTable').on( 'click', '.clickToUpdate', function () {
        $scope.clickToUpdate($(this).data('id'));
    });
    $scope.clickToUpdate = function(id) {
        
        var item = getItemByID(id);
console.log(item)
        ngDialog.openConfirm({
            template: 'views/location/model_update_location.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', '$filter', 'data', function($scope, $filter, data){
                $scope.mItem = item;
                $scope.errorMsg = [];

console.log($scope.mItem);
                // Create Location
                $scope.save = function() {

                    LocationService.updateLocation($scope.mItem).then(function(res) {

                        if(res.data.status == 'success') {
                            ngDialog.close();
                            toastr.success('Updated an item', 'Success');
                        } else {
                            $scope.errorMsg = res.data.error;
                            
                        }

                    });
                }

                // Close popup Location
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

    // Click to Delete
    $('#dataTable').on( 'click', '.clickToDelete', function () {
        $scope.clickToDelete($(this).data('id'));
    });
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

            LocationService.deleteLocation(id).then(function(res) {
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

        // $scope.dtOptions = DTOptionsBuilder.newOptions()
        //     .withOption('ajax', {
        //      // Either you specify the AjaxDataProp here
        //      // dataSrc: 'data',
        //     // headers: {'Authorization': "datvesieure:balobooking"},
        //     url: $rootScope.settings.apiPath + 'location/index',
        //     type: 'GET',
        //     // beforeSend: function (xhr) {
        //     //     xhr.setRequestHeader('Authorization', "datvesieure:balobooking");
        //     // },
        //     beforeSend: function(xhr){
        //         xhr.setRequestHeader("Authorization",
        //         "Basic " + btoa($base64.encode('datvesieure' + ":" + 'balobooking')));
        //     },
        //  })
        //     // Add your custom button in the DOM
        //  // or here
        //  .withDataProp('data')
        //     .withOption('processing', true)
        //     .withOption('serverSide', true)
        //     .withPaginationType('full_numbers');
        // $scope.dtColumns = [
        //     DTColumnBuilder.newColumn('name').withTitle('Name'),
        //     DTColumnBuilder.newColumn('code').withTitle('Code'),
        //     DTColumnBuilder.newColumn(null).withTitle('Action').notSortable()
        //     .renderWith(actionsHtml)
        // ];
        
    
    }

    function actionsHtml(data, type, full, meta) {
        console.log(data);
        return 
            '</button>&nbsp;' +'<button class="btn btn-warning" ng-click="clickToUpdate(' + data + ')">' +
            '   <i class="fa fa-edit"></i>' +"Edit"+
            '</button>&nbsp;' +
            '<button class="btn btn-danger" ng-click="clickToDelete(' + data.id + ')">' +
            '   <i class="fa fa-trash-o"></i>' +"Delete"
            '</button>';
    }

    function loadListItem() {
        LocationService.getLocations().then(function(res) {

            if(res.statusText == 'OK') {
                $scope.listItem = res.data.data;

                var dataset = [];
                angular.forEach(res.data.data, function(row, key) {
                    var temp = [];
                    angular.forEach(row, function(v, k) {
                        temp.push(v);
                        
                    });
                    dataset.push(temp);
                });

                $('#dataTable').DataTable( {
                    data: dataset,
                    "columnDefs": [
                        { "visible": false,  "targets": [0] },
                        { title: "Name" , "targets": [1] },
                        { title: "Code" , "targets": [2] },
                        // {
                        //     "targets": 3,
                        //     "data": null,
                        //     "defaultContent": "<button>Click!</button>"
                        // },
                        {
                            "render": function ( data, type, row, $index ) {

                                return '</button>&nbsp;' +'<button class="btn btn-warning clickToUpdate" data-id="' + row[0] + '">' +
                                '   <i class="fa fa-edit"></i>' +"Edit"+
                                '</button>&nbsp;' +
                                '<button class="btn btn-danger clickToDelete" data-id="' + row[0] + '">' +
                                '   <i class="fa fa-trash-o"></i>' +"Delete"+
                                '</button>';
                            },
                            "targets": 3
                        },

                    ]
                    // columns: [
                    //     { title: "ID" },
                    //     { title: "Name" },
                    //     { title: "Code" }
                    // ]
                });
            }
            
        });
    }


});


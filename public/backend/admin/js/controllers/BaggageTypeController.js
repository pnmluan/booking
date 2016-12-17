angular.module('MetronicApp').controller('BaggageTypeController', function($rootScope, $scope, $http, $base64, $timeout, $location, $q, BaggageTypeService, ngDialog, toastr, DTOptionsBuilder, DTColumnBuilder, Upload) {
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
            template: 'views/baggagetype/model_add_baggagetype.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', 'data', function($scope, data){
                $scope.mItem = {};
                $scope.errorMsg = [];

                $scope.optionStatus = data.optionStatus;
                $scope.optionStatus.selected = data.optionStatus[0];

                // Create BaggageType
                $scope.save = function() {
                    $scope.mItem.provider = $scope.optionProvider.selected.id;
                    $scope.mItem.status = $scope.optionStatus.selected.id;
                    BaggageTypeService.create($scope.mItem).then(function(res) {

                        if(res.data.status == 'success') {
                            data.dtInstance.reloadData();
                            $scope.mItem = {};
                            toastr.success('Added an item', 'Success');
                            $scope.errorMsg = [];
                        } else {
                            $scope.errorMsg = res.data.error;
                            
                        }

                    });
                }

                // Close popup BaggageType
                $scope.close = function() {
                    ngDialog.close();
                }
            }],
            resolve: {
                data: function () {
                    var data = {
                        optionStatus: $scope.optionStatus,
                        dtInstance: $scope.dtInstance
                    }
                    return data;
                }
            }
        });
    };

    // Get item By ID
    function getItemByID(id) {
        var deferred = $q.defer();
        var item = {};
        BaggageTypeService.getBaggageTypes().then(function(res) {

            if(res.statusText == 'OK') {

                angular.forEach(res.data.data, function(row, key) {
                    if(row.id == id) {
                        return deferred.resolve(row);
                    }
                });
            }
        });
        
        return deferred.promise;
    }

    // Click to Update
    $scope.clickToUpdate = function(item) {
        ngDialog.openConfirm({
            template: 'views/baggagetype/model_update_baggagetype.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', '$filter', 'data', function($scope, $filter, data){
                $scope.mItem = item;
                $scope.errorMsg = [];

                $scope.optionStatus = data.optionStatus;
                angular.forEach($scope.optionStatus, function(value, key){
                    if(value.id == item.status) {
                        $scope.optionStatus.selected = value;
                        return;
                    }
                });

                //Load Image
                $scope.img = $scope.settings.imgPath + 'baggagetype/' + item.img; 

                // Create BaggageType
                $scope.save = function() {
                    $scope.mItem.status = $scope.optionStatus.selected.id;
                    $scope.mItem.provider = $scope.optionProvider.selected.id;
                    BaggageTypeService.update($scope.mItem).then(function(res) {

                        if(res.data.status == 'success') {
                            data.dtInstance.reloadData();
                            ngDialog.close();
                            toastr.success('Updated an item', 'Success');
                        } else {
                            $scope.errorMsg = res.data.error;
                            
                        }

                    });
                }

                // Close popup BaggageType
                $scope.close = function() {
                    ngDialog.close();
                }

            }],
            resolve: {
                data: function () {
                    var data = {
                        optionStatus: $scope.optionStatus,
                        dtInstance: $scope.dtInstance
                    }
                    return data;
                }
            }
        });

        
    }

    // Click to Delete
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

            BaggageTypeService.delete(id).then(function(res) {
                if(res.data.status == 'success') {
                    toastr.success('Deleted an item', 'Success');
                    $scope.dtInstance.reloadData();
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

        $scope.optionProvider = [
            {id: 'vietjet', name: 'VietJet'},
            {id: 'jetstar', name: 'JetStar'},
            {id: 'vna', name: 'VietNam Airline'},
        ];
        $scope.optionProvider.selected = $scope.optionProvider[0];
        
        $scope.listItem = [];
        $scope.dtInstance = {};

        var table = 'baggagetype'
        var params = $location.search();
        var imgUrl = $rootScope.settings.imgPath + table + '/';

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('ajax',{
                beforeSend: function(xhr){
                    xhr.setRequestHeader('Authorization',"Basic " + $base64.encode('datvesieure' + ":" + 'balobooking'));
                },
                data: params,
                url: $rootScope.settings.apiPath + table + '/index',
                type: 'GET',
        }).withDataProp('data')
            .withOption('processing',true)
            .withOption('serverSide',true)
            .withOption('filter',false)
            .withOption('lengthChange',false)
            .withDisplayLength(20)
            .withOption('rowCallback',function(row,data){
                $('td > .clickToUpdate', row).bind('click', function(){
                    $scope.clickToUpdate(data);
                });

                $('td > .clickToDelete', row).bind('click', function(){
                    $scope.clickToDelete(data.id);
                });
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').notVisible(),
            DTColumnBuilder.newColumn('name').withTitle('Name'),
            DTColumnBuilder.newColumn('fare').withTitle('Price'),
            DTColumnBuilder.newColumn('provider').withTitle('Provider'),
            DTColumnBuilder.newColumn('status').withTitle('Status'),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('createdCell',function(td,cellData,rowData,row,col){
                
               var string_html = `</button>&nbsp;<button class="btn btn-warning clickToUpdate"><i class="fa fa-edit"></i>Edit</button>&nbsp;` +
                                 `<button class="btn btn-danger clickToDelete"><i class="fa fa-trash-o"></i>Delete </button>`;
                $(td).html(string_html);
            }).withOption('width','auto'),
        ];
    }

    function loadListItem() {
        BaggageTypeService.getBaggageTypes().then(function(res) {

            if(res.statusText == 'OK') {
                $scope.listItem = res.data.data;
                return $scope.listItem;
            }
            return;
            
        });
    }
});

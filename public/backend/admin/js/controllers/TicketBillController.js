angular.module('MetronicApp').controller('TicketBillController', function($rootScope, $scope, $http, $base64, $timeout, $location, $q, TicketBillService, TicketDetailService, ngDialog, toastr, DTOptionsBuilder, DTColumnBuilder, Upload) {
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
            template: 'views/ticketbill/model_add_ticket_bill.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: ['$scope', 'data', function($scope, data){
                $scope.mItem = {};
                $scope.errorMsg = [];

                $scope.optionStatus = data.optionStatus;
                $scope.optionStatus.selected = data.optionStatus[0];

                // Create TicketBill
                $scope.save = function() {
                    $scope.mItem.provider = $scope.optionProvider.selected.id;
                    $scope.mItem.status = $scope.optionStatus.selected.id;
                    TicketBillService.create($scope.mItem).then(function(res) {

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

                // Close popup TicketBill
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

    // Click to View
    $scope.clickToView = function(item) {
        ngDialog.openConfirm({
            template: 'views/ticketbill/model_view_ticket_bill.html',
            className: 'ngdialog-theme-large',
            scope: $scope,
            controller: ['$scope', '$filter', 'data', ($scope, $filter, data) => {
                $scope.customerTypeOptions = data.customerTypeOptions;
                $scope.mItem = item;
                
                // Get Booking Detail with Passengers
                var params = {
                    ticket_bill_id: item.id
                };
                TicketDetailService.getAll($.param(params)).then((res) => {
                    var details = res.data.data;
                    if(details) {
                        var total_payment = 0;
                        angular.forEach(details, (detail, key) => {
                            var total = 0;
                            angular.forEach(detail.passengers, (p, k) => {
                                p.fare_tax = p.admin_fee + p.airport_fee + p.charge + p.fare + p.payment_fee + p.security_fee + p.other_tax;
                                total += p.fare_tax;
                            });
                            detail.total = total;
                            total_payment += total;
                        });
                        $scope.mItem.total_payment = total_payment;
                        $scope.mItem.details = details;
                        console.log(details);
                    }
                });

                // Show Data Passengers
                $scope.onShowPassengers = function(val = null) {

                }

                // Create Booking
                $scope.onApprove = function() {

                    var params = {
                        id: $scope.mItem.id,
                        state: 'approve'
                    };
                    TicketBillService.update(params).then((res) => {

                        if(res.data.status == 'success') {
                            data.dtInstance.reloadData();
                            ngDialog.close();
                            toastr.success('Updated an item', 'Success');
                        } else {
                            $scope.errorMsg = res.data.error;
                            
                        }

                    });
                }

                // Close popup Booking
                $scope.close = function() {
                    ngDialog.close();
                }

            }],
            resolve: {
                data: function () {
                    var data = {
                        optionStatus: $scope.optionStatus,
                        dtInstance: $scope.dtInstance,
                        customerTypeOptions: $scope.settings.customerTypeOptions
                    }
                    return data;
                }
            }
        });

        
    }

    // Get item By ID
    function getItemByID(id) {
        var deferred = $q.defer();
        var item = {};
        TicketBillService.getTicketBills().then(function(res) {

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

    // Click to UpdateH
    $scope.clickToUpdate = function(item) {
        ngDialog.openConfirm({
            template: 'views/ticketbill/model_update_ticket_bill.html',
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
                $scope.img = $scope.settings.imgPath + 'ticket_bill/' + item.img; 

                // Create TicketBill
                $scope.save = function() {
                    $scope.mItem.status = $scope.optionStatus.selected.id;
                    $scope.mItem.provider = $scope.optionProvider.selected.id;
                    TicketBillService.update($scope.mItem).then(function(res) {

                        if(res.data.status == 'success') {
                            data.dtInstance.reloadData();
                            ngDialog.close();
                            toastr.success('Updated an item', 'Success');
                        } else {
                            $scope.errorMsg = res.data.error;
                            
                        }

                    });
                }

                // Close popup TicketBill
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

            TicketBillService.delete(id).then(function(res) {
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

        var table = 'ticket_bill'
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

                $('td > .clickToView', row).bind('click', function(){
                    $scope.clickToView(data);
                });

                $('td > .clickToDelete', row).bind('click', function(){
                    $scope.clickToDelete(data.id);
                });
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').notVisible(),
            DTColumnBuilder.newColumn('fullname').withTitle('Name'),
            DTColumnBuilder.newColumn('email').withTitle('Email'),
            DTColumnBuilder.newColumn('phone').withTitle('Phone'),
            DTColumnBuilder.newColumn('total_fare').withTitle('Total'),
            DTColumnBuilder.newColumn('state').withTitle('State').withOption('createdCell',function(td,cellData,rowData,row,col){
               var string_html = $scope.settings.statePending;
               if(cellData == 'approve') {
                    string_html = $scope.settings.stateApproved;
               }
                $(td).html(string_html);
            }).withOption('width','auto'),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('createdCell',function(td,cellData,rowData,row,col){
               var string_html = $scope.settings.btnView + $scope.settings.btnDelete;
                $(td).html(string_html);
            }).withOption('width','auto'),
        ];
    }

    function loadListItem() {
        TicketBillService.getTicketBills().then(function(res) {

            if(res.statusText == 'OK') {
                $scope.listItem = res.data.data;
                return $scope.listItem;
            }
            return;
            
        });
    }
});

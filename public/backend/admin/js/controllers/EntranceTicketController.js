angular.module('MetronicApp').controller('EntranceTicketController', function($rootScope, $scope, $http, $base64, $timeout, $location, $q, EntranceTicketService, CategoryTicketService, AlbumTicketService, ngDialog, toastr, DTOptionsBuilder, DTColumnBuilder, Upload) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
        // toastr.info('We are open today from 10 to 22', 'Information');
    });

    mine = $scope;
    initialize();

    $scope.classNameStatus = function(status) {
        switch (status) {
            case 'active':
                return 'label label-sm label-success';
            case 'inactive':
                return 'label label-sm label-danger';
        }
    };

    // Click to Add New
    $scope.clickToAddNew = function() {

        if ($scope.optionCategoryTicket.length) {
            ngDialog.openConfirm({
                template: 'views/entranceticket/model_add_entrance_ticket.html',
                className: 'ngdialog-theme-large',
                scope: $scope,
                controller: ['$scope', 'data', function($scope, data) {
                    $scope.mItem = {};
                    $scope.errorMsg = [];

                    $scope.optionCategoryTicket = data.optionCategoryTicket;
                    $scope.optionCategoryTicket.selected = data.optionCategoryTicket[0];

                    $scope.optionStatus = data.optionStatus;
                    $scope.optionStatus.selected = data.optionStatus[0];

                    // Remove img in list
                    $scope.removeImg = function($event, img, index) {
                        $event.stopPropagation();
                        $scope.imgs.splice(index, 1);
                    }

                    // Create EntranceTicket
                    $scope.save = function() {
                        $scope.mItem.category_ticket_id = $scope.optionCategoryTicket.selected.id;
                        $scope.mItem.status = $scope.optionStatus.selected.id;

                        EntranceTicketService.create($scope.mItem).then(function(res) {

                            if (res.data.status == 'success') {

                                var params = {
                                    entrance_ticket_id: res.data.data.id
                                };
                                AlbumTicketService.create($scope.imgs, params).then(function(res) {


                                });

                                data.dtInstance.reloadData();
                                $scope.mItem = {};
                                toastr.success('Added an item', 'Success');
                                $scope.errorMsg = [];
                            } else {
                                $scope.errorMsg = res.data.error;

                            }

                        });
                    }

                    // Close popup entrance_ticket
                    $scope.close = function() {
                        ngDialog.close();
                    }
                }],
                resolve: {
                    data: function() {
                        var data = {
                            optionStatus: $scope.optionStatus,
                            dtInstance: $scope.dtInstance,
                            optionCategoryTicket: $scope.optionCategoryTicket
                        }
                        return data;
                    }
                }
            });
        } else {
            swal({
                title: "Adding Category Ticket",
                text: "Please add category ticket before adding ticket!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "Yes, add category",
            }).then(function() {

                setTimeout(function() {
                    $location.path('/category_ticket');
                }, 1000)

            });
        }

    };


    // Get item By ID
    function getItemByID(id) {
        var deferred = $q.defer();
        var item = {};
        EntranceTicketService.getEntranceTickets().then(function(res) {

            if (res.statusText == 'OK') {

                angular.forEach(res.data.data, function(row, key) {
                    if (row.id == id) {
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
            template: 'views/entranceticket/model_update_entrance_ticket.html',
            className: 'ngdialog-theme-large',
            scope: $scope,
            controller: ['$scope', '$filter', 'data', function($scope, $filter, data) {
                $scope.mItem = item;
                $scope.errorMsg = [];

                $scope.optionCategoryTicket = data.optionCategoryTicket;
                angular.forEach($scope.optionCategoryTicket, function(value, key) {
                    if (value.id == item.category_ticket_id) {
                        $scope.optionCategoryTicket.selected = value;
                        return;
                    }
                });

                $scope.optionStatus = data.optionStatus;
                angular.forEach($scope.optionStatus, function(value, key) {
                    if (value.id == item.status) {
                        $scope.optionStatus.selected = value;
                        return;
                    }
                });

                var query = {
                    entrance_ticket_id: item.id
                };
                let imgs = [];
                let arr_removed_img = [];
                let arr_img = [];
                //Load Images
                AlbumTicketService.getAll($.param(query)).then(function(res) {
                    if (res.data.data.length) {

                        angular.forEach(res.data.data, function(value, key) {
                            imgs.push($scope.settings.imgPath + 'album_ticket/' + value.img);
                            arr_img.push(value.img);
                        });

                        $scope.imgs = JSON.parse(JSON.stringify(imgs));

                    }

                });

                // Remove img in list
                $scope.removeImg = function($event, img, index) {
                    $event.stopPropagation();
                    angular.forEach(arr_img, function(value, key) {
                        if ($scope.settings.imgPath + 'album_ticket/' + value == img) {
                            arr_removed_img.push(value);
                            return;
                        }

                    });

                    $scope.imgs.splice(index, 1);
                    console.log($scope.imgs);
                }


                // Create entrance_ticket
                $scope.save = function() {

                    $scope.mItem.category_ticket_id = $scope.optionCategoryTicket.selected.id;
                    if($scope.optionStatus.selected) {
                        $scope.mItem.status = $scope.optionStatus.selected.id;
                    } else {
                        $scope.mItem.status = 'active';
                    }
                    
                    
                    EntranceTicketService.update($scope.mItem).then(function(res) {

                        if (res.data.status == 'success') {
                            var imgs = [];
                            angular.forEach($scope.imgs, function(value, key) {
                                if (typeof value === 'object') {
                                    imgs.push(value);
                                }
                            });
                            var params = {
                                entrance_ticket_id: res.data.data.id,
                                removed_imgs: arr_removed_img
                            };
                            AlbumTicketService.create(imgs, params).then(function(res) {


                            });

                            data.dtInstance.reloadData();
                            ngDialog.close();
                            toastr.success('Updated an item', 'Success');
                        } else {
                            $scope.errorMsg = res.data.error;

                        }

                    });
                }

                // Close popup EntranceTicket
                $scope.close = function() {
                    ngDialog.close();
                }

            }],
            resolve: {
                data: function() {
                    var data = {
                        optionStatus: $scope.optionStatus,
                        dtInstance: $scope.dtInstance,
                        optionCategoryTicket: $scope.optionCategoryTicket
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

            EntranceTicketService.delete(id).then(function(res) {
                if (res.data.status == 'success') {
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
            { id: 'active', name: 'Active' },
            { id: 'inactive', name: 'Inactive' },
        ];

        let query = {
            status: 'active'
        };
        $scope.optionCategoryTicket = [];
        CategoryTicketService.getAll($.param(query)).then(function(res) {
            if (res.data.data) {
                $scope.optionCategoryTicket = res.data.data;

            }

        });

        $scope.listItem = [];
        $scope.dtInstance = {};

        var table = 'entrance_ticket'
        var params = $location.search();
        var imgUrl = $rootScope.settings.imgPath + table + '/';

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('ajax', {
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', "Basic " + $base64.encode('datvesieure' + ":" + 'balobooking'));
                },
                data: params,
                url: $rootScope.settings.apiPath + table + '/index',
                type: 'GET',
            }).withDataProp('data')
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withOption('filter', true)
            .withOption('lengthChange', false)
            .withDisplayLength(20)
            .withOption('rowCallback', function(row, data) {
                $('td > .clickToUpdate', row).bind('click', function() {
                    $scope.clickToUpdate(data);
                });

                $('td > .clickToDelete', row).bind('click', function() {
                    $scope.clickToDelete(data.id);
                });
            });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').notVisible(),

            DTColumnBuilder.newColumn('name').withTitle('Title').withOption('width', '200px'),
            DTColumnBuilder.newColumn('category_ticket_name').withTitle('Category'),
            DTColumnBuilder.newColumn('adult_fare').withTitle('Adult Fare').withOption('createdCell', function(td, cellData, rowData, row, col) {

                $(td).html(cellData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }).withOption('width', 'auto'),
            DTColumnBuilder.newColumn('children_fare').withTitle('Children Fare').withOption('createdCell', function(td, cellData, rowData, row, col) {

                $(td).html(cellData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }).withOption('width', 'auto'),
            DTColumnBuilder.newColumn('description').withTitle('Description'),
            // DTColumnBuilder.newColumn('created_at').withTitle('Created Date'),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('createdCell', function(td, cellData, rowData, row, col) {

                var string_html = `</button>&nbsp;<button class="btn btn-warning clickToUpdate"><i class="fa fa-edit"></i>Edit</button>&nbsp;` +
                    `<button class="btn btn-danger clickToDelete"><i class="fa fa-trash-o"></i>Delete </button>`;
                $(td).html(string_html);
            }).withOption('width', 'auto'),
        ];
    }

    function loadListItem() {
        EntranceTicketService.getEntranceTickets().then(function(res) {

            if (res.statusText == 'OK') {
                $scope.listItem = res.data.data;
                return $scope.listItem;
            }
            return;

        });
    }
});

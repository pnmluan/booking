angular.module('MetronicApp').controller('ArticleController', function($rootScope, $scope, $http, $base64, $timeout, $location, $q, ArticleService, CategoryService, PictureService, ngDialog, toastr, DTOptionsBuilder, DTColumnBuilder, Upload) {
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

        if ($scope.optionCategory.length) {
            ngDialog.openConfirm({
                template: 'views/article/model_form_article.html',
                className: 'ngdialog-theme-large',
                scope: $scope,
                controller: ['$scope', 'data', function($scope, data) {
                    $scope.mItem = {};
                    $scope.errorMsg = [];

                    $scope.optionCategory = data.optionCategory;
                    $scope.optionCategory.selected = data.optionCategory[0];

                    $scope.optionStatus = data.optionStatus;
                    $scope.optionStatus.selected = data.optionStatus[0];

                    // Remove img in list
                    $scope.removeImg = function($event, img, index) {
                        $event.stopPropagation();
                        $scope.imgs.splice(index, 1);
                    }

                    // Create article
                    $scope.save = function() {
                        $scope.mItem.category_id = $scope.optionCategory.selected.id;
                        $scope.mItem.status = $scope.optionStatus.selected.id;

                        ArticleService.save($scope.mItem).then(function(res) {

                            if (res.status == 200) {

                                var params = {
                                    article_id: res.data.data.id
                                };
                                PictureService.save($scope.imgs, params).then(function(res) {
                                    if(res.status == 200) {
                                        data.dtInstance.reloadData();
                                        $scope.mItem = {};
                                        toastr.success('Added an item', 'Success');
                                        $scope.errorMsg = [];
                                    }
                                });
                                
                            } else {
                                $scope.errorMsg = res.data.error;

                            }

                        }, function(res) {
                            console.log(res)
                            if(res.status != 200) {
                                toastr.success('Added an item', 'Success');
                            }
                        });
                    }

                    // Close popup article
                    $scope.close = function() {
                        ngDialog.close();
                    }
                }],
                resolve: {
                    data: function() {
                        var data = {
                            optionStatus: $scope.optionStatus,
                            dtInstance: $scope.dtInstance,
                            optionCategory: $scope.optionCategory
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
                    $location.path('/category');
                }, 1000)

            });
        }

    };


    // Get item By ID
    function getItemByID(id) {
        var deferred = $q.defer();
        var item = {};
        ArticleService.getAll().then(function(res) {

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
            template: 'views/article/model_form_article.html',
            className: 'ngdialog-theme-large',
            scope: $scope,
            controller: ['$scope', '$filter', 'data', function($scope, $filter, data) {
                $scope.mItem = item;
                console.log(item);
                $scope.errorMsg = [];

                $scope.optionCategory = data.optionCategory;
                angular.forEach($scope.optionCategory, function(value, key) {
                    if (value.id == item.category_id) {
                        $scope.optionCategory.selected = value;
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
                    article_id: item.article_id
                };
                let temp_imgs = [];
                let arr_removed_img = [];
                let arr_img = [];
                //Load Images
                
                if(item.pictures.length) {
                    angular.forEach(item.pictures, function(value, key) {
                        temp_imgs.push($scope.settings.imgPath + 'picture/' + value.filepath);
                        arr_img.push(value.filepath);
                    });
                    $scope.imgs = JSON.parse(JSON.stringify(temp_imgs));
                }
                

                // Remove img in list
                $scope.removeImg = function($event, img, index) {
                    $event.stopPropagation();
                    angular.forEach(arr_img, function(value, key) {
                        if ($scope.settings.imgPath + 'picture/' + value == img) {
                            arr_removed_img.push(value);
                            return;
                        }

                    });
                    $scope.imgs.splice(index, 1);
                    
                }


                // Create article
                $scope.save = function() {
                    console.log($scope.imgs);
                    $scope.mItem.category_id = $scope.optionCategory.selected.id;
                    if($scope.optionStatus.selected) {
                        $scope.mItem.status = $scope.optionStatus.selected.id;
                    } else {
                        $scope.mItem.status = 'active';
                    }
                    
                    
                    ArticleService.save($scope.mItem, $scope.mItem.id).then(function(res) {

                        if (res.status == 200) {
                            var imgs = [];
                            angular.forEach($scope.imgs, function(value, key) {
                                if (typeof value === 'object') {
                                    imgs.push(value);
                                }
                            });
                            var params = {
                                article_id: res.data.data.id,
                                removed_imgs: arr_removed_img
                            };
                            
                            PictureService.save(imgs, params).then(function(res) {
                                if(res.status == 200) {
                                    data.dtInstance.reloadData();
                                    ngDialog.close();
                                    toastr.success('Updated an item', 'Success');
                                }
                            });

                            
                        } else {
                            $scope.errorMsg = res.data.error;

                        }

                    });
                }

                // Close popup article
                $scope.close = function() {
                    ngDialog.close();
                }

            }],
            resolve: {
                data: function() {
                    var data = {
                        optionStatus: $scope.optionStatus,
                        dtInstance: $scope.dtInstance,
                        optionCategory: $scope.optionCategory
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

            ArticleService.delete(id).then(function(res) {
                if (res.status == 200) {
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
        $scope.optionCategory = [];
        CategoryService.getAll($.param(query)).then(function(res) {
            if (res.data.data) {
                $scope.optionCategory = res.data.data;

            }

        });

        $scope.listItem = [];
        $scope.dtInstance = {};

        var table = 'article'
        var params = $location.search();
        var imgUrl = $rootScope.settings.imgPath + table + '/';

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('ajax', {
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', "Basic " + $base64.encode('datvesieure' + ":" + 'balobooking'));
                },
                data: params,
                url: $rootScope.settings.apiPath + table + '/index?has_data_table=1',
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
            DTColumnBuilder.newColumn('title').withTitle('Title').withOption('width', '200px'),
            DTColumnBuilder.newColumn('category_name').withTitle('Category'),
            DTColumnBuilder.newColumn('description').withTitle('Description'),
            DTColumnBuilder.newColumn('author_id').withTitle('Author'),
            DTColumnBuilder.newColumn('publish_date').withTitle('Publish Date'),
            DTColumnBuilder.newColumn('status').withTitle('Status'),
            // DTColumnBuilder.newColumn('created_at').withTitle('Created Date'),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('createdCell', function(td, cellData, rowData, row, col) {

                var string_html = `</button>&nbsp;<button class="btn btn-warning clickToUpdate"><i class="fa fa-edit"></i>Edit</button>&nbsp;` +
                    `<button class="btn btn-danger clickToDelete"><i class="fa fa-trash-o"></i>Delete </button>`;
                $(td).html(string_html);
            }).withOption('width', 'auto'),
        ];
    }

    function loadListItem() {
        ArticleService.getAll().then(function(res) {

            if (res.statusText == 'OK') {
                $scope.listItem = res.data.data;
                return $scope.listItem;
            }
            return;

        });
    }
});

angular.module('MetronicApp')
    .factory('CommentService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'comment';
    var service = {};

    service.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    service.create = function (img,  cust) {
        return Upload.upload({
            url: urlBase + '/create',
            data: {
                data: cust,
                img: img
            },
        });
    };

    service.update = function (img, cust) {
        return Upload.upload({
            url: urlBase + '/update/' + cust.id,
            data: {
                data: cust,
                img: img
            },
        });
    };

    service.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return service;
}]);
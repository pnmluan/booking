angular.module('MetronicApp')
    .factory('CommentService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'comment';
    var CommentService = {};

    CommentService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    CommentService.create = function (img,  cust) {
        return Upload.upload({
            url: urlBase + '/create',
            data: {
                data: cust,
                img: img
            },
        });
    };

    CommentService.update = function (img, cust) {
        return Upload.upload({
            url: urlBase + '/update/' + cust.id,
            data: {
                data: cust,
                img: img
            },
        });
    };

    CommentService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return CommentService;
}]);
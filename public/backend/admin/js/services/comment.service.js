angular.module('MetronicApp')
    .factory('CommentService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'comment';
    var CommentService = {};

    CommentService.getComments = function () {
        return $http.get(urlBase + '/index');
    };

    CommentService.createComment = function (img,  cust) {
        return Upload.upload({
            url: urlBase + '/create',
            data: {
                data: cust,
                img: img
            },
        });
    };

    CommentService.updateComment = function (img, cust) {
        return Upload.upload({
            url: urlBase + '/update/' + cust.id,
            data: {
                data: cust,
                img: img
            },
        });
    };

    CommentService.deleteComment = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return CommentService;
}]);
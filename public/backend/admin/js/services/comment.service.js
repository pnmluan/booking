angular.module('MetronicApp')
    .factory('CommentService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'comment';
    var CommentService = {};

    CommentService.getComments = function () {
        return $http.get(urlBase + '/index');
    };

    CommentService.createComment = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    CommentService.updateComment = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    CommentService.deleteComment = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return CommentService;
}]);
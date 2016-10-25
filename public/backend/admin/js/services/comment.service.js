angular.module('MetronicApp')
    .factory('CommentService', ['$http', '$rootScope', function($http, $rootScope) {

    

    var urlBase = $rootScope.settings.apiPath + 'comment';
    var CommentService = {};

    CommentService.getComment = function () {
        return $http.get(urlBase);
    };

    CommentService.getCustomer = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    CommentService.insertCustomer = function (cust) {
        return $http.post(urlBase, cust);
    };

    CommentService.updateCustomer = function (cust) {
        return $http.put(urlBase + '/' + cust.ID, cust)
    };

    CommentService.deleteCustomer = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    CommentService.getOrders = function (id) {
        return $http.get(urlBase + '/' + id + '/orders');
    };

    return CommentService;
}]);
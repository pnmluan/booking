angular.module('MetronicApp')
    .factory('CategoryTicketService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'category_ticket';
    var CategoryTicketService = {};

    CategoryTicketService.getAll = function (params = null) {
        return $http.get(urlBase + '/index?'+ params);
    };

    CategoryTicketService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    CategoryTicketService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    CategoryTicketService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return CategoryTicketService;
}]);
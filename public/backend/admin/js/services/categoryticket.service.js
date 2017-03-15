angular.module('MetronicApp')
    .factory('CategoryTicketService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'category_ticket';
    var service = {};

    service.getAll = function (params = null) {
        return $http.get(urlBase + '/index?'+ params);
    };

    service.save = function (cust, id = null) {
        if(id) {
            return $http.post(urlBase + '/save/' + cust.id, cust)
        } else {
            return $http.post(urlBase + '/save', cust)
        }
        
    };

    service.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return service;
}]);
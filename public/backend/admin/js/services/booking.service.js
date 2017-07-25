angular.module('MetronicApp')
    .factory('BookingService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'booking';
    var service = {};

    service.getAll = function () {
        return $http.get(urlBase + '/index');
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
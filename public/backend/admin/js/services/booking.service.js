angular.module('MetronicApp')
    .factory('BookingService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'booking';
    var BookingService = {};

    BookingService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    BookingService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    BookingService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    BookingService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return BookingService;
}]);
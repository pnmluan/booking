angular.module('MetronicApp')
    .factory('LocationService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'location';
    var LocationService = {};

    LocationService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    LocationService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    LocationService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    LocationService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return LocationService;
}]);
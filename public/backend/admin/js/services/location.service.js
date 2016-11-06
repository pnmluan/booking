angular.module('MetronicApp')
    .factory('LocationService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'location';
    var LocationService = {};

    LocationService.getLocations = function () {
        return $http.get(urlBase + '/index');
    };

    LocationService.createLocation = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    LocationService.updateLocation = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    LocationService.deleteLocation = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return LocationService;
}]);
angular.module('MetronicApp')
    .factory('PassengerService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'Passenger';
    var PassengerService = {};

    PassengerService.getAll = function (params = null) {
        if(params) {
            return $http.get(urlBase + '/index?'+ params);
        }
        return $http.get(urlBase + '/index');
    };

    PassengerService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    PassengerService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    PassengerService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return PassengerService;
}]);
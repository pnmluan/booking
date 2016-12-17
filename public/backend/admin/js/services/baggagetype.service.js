angular.module('MetronicApp')
    .factory('BaggageTypeService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'baggagetype';
    var BaggageTypeService = {};

    BaggageTypeService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    BaggageTypeService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    BaggageTypeService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    BaggageTypeService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return BaggageTypeService;
}]);
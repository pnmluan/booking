angular.module('MetronicApp')
    .factory('ProviderService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'provider';
    var ProviderService = {};

    ProviderService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    ProviderService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    ProviderService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    ProviderService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return ProviderService;
}]);
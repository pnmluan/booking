angular.module('MetronicApp')
    .factory('BaggageTypeService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'baggagetype';
    var serive = {};

    serive.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    service.save = function (cust, id = null) {
        if(id) {
            return $http.post(urlBase + '/save/' + cust.id, cust)
        } else {
            return $http.post(urlBase + '/save', cust)
        }
        
    };

    serive.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return serive;
}]);
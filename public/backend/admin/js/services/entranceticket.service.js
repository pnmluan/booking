angular.module('MetronicApp')
    .factory('EntranceTicketService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'entrance_ticket';
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
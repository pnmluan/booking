angular.module('MetronicApp')
    .factory('EntranceTicketService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'entrance_ticket';
    var EntranceTicketService = {};

    EntranceTicketService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    EntranceTicketService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    EntranceTicketService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    EntranceTicketService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return EntranceTicketService;
}]);
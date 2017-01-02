angular.module('MetronicApp')
    .factory('TicketDetailService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'ticket_detail';
    var TicketDetailService = {};

    TicketDetailService.getAll = function (params = null) {
        return $http.get(urlBase + '/index?'+ params);
    };

    TicketDetailService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    TicketDetailService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    TicketDetailService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return TicketDetailService;
}]);
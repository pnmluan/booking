angular.module('MetronicApp')
    .factory('TicketBillService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'ticket_bill';
    var TicketBillService = {};

    TicketBillService.getAll = function (params = null) {
        return $http.get(urlBase + '/index?'+ params);
    };

    TicketBillService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    TicketBillService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    TicketBillService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return TicketBillService;
}]);
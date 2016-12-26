angular.module('MetronicApp')
    .factory('EntranceTicketService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'entrance_ticket';
    var EntranceTicketService = {};

    EntranceTicketService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    EntranceTicketService.create = function (img,  cust) {
        return Upload.upload({
            url: urlBase + '/create',
            data: {
                data: cust,
                img: img
            },
        });
    };

    EntranceTicketService.update = function (img, cust) {
        return Upload.upload({
            url: urlBase + '/update/' + cust.id,
            data: {
                data: cust,
                img: img
            },
        });
    };

    EntranceTicketService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return EntranceTicketService;
}]);
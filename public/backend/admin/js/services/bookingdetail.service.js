angular.module('MetronicApp')
    .factory('BookingDetailService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'BookingDetail';
    var BookingDetailService = {};

    BookingDetailService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    BookingDetailService.create = function (cust) {
        return $http.post(urlBase + '/create', cust);
    };

    BookingDetailService.update = function (cust) {
        return $http.put(urlBase + '/update/' + cust.id, cust)
    };

    BookingDetailService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return BookingDetailService;
}]);
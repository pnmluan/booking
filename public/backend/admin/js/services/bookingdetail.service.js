angular.module('MetronicApp')
    .factory('BookingDetailService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'booking_detail';
    var BookingDetailService = {};

    BookingDetailService.getAll = function (params = null) {
        if(params) {
            return $http.get(urlBase + '/index?'+ params);
        }
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
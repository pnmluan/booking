angular.module('MetronicApp')
    .factory('BookingDetailService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'booking_detail';
    var service = {};

    service.getAll = function (params = null) {
        if(params) {
            return $http.get(urlBase + '/index?'+ params);
        }
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
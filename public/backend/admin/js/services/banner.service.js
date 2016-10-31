angular.module('MetronicApp')
    .factory('BannerService', ['$http', '$rootScope', function($http, $rootScope) {

    var urlBase = $rootScope.settings.apiPath + 'banner';
    var BannerService = {};

    BannerService.getBanner = function () {
        return $http.get(urlBase);
    };

    BannerService.getCustomer = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    BannerService.insertCustomer = function (cust) {
        return $http.post(urlBase, cust);
    };

    BannerService.updateCustomer = function (cust) {
        return $http.put(urlBase + '/' + cust.ID, cust)
    };

    BannerService.deleteCustomer = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    BannerService.getOrders = function (id) {
        return $http.get(urlBase + '/' + id + '/orders');
    };

    return BannerService;
}]);
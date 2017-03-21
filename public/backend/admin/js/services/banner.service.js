angular.module('MetronicApp')
    .factory('BannerService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'banner';
    var BannerService = {};

    BannerService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    BannerService.create = function (img,  cust) {
        return Upload.upload({
            url: urlBase + '/save',
            data: {
                data: cust,
                img: img
            },
        });
    };

    BannerService.update = function (img, cust) {
        return Upload.upload({
            url: urlBase + '/save/' + cust.id,
            data: {
                data: cust,
                img: img
            },
        });
    };

    BannerService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return BannerService;
}]);
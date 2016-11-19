angular.module('MetronicApp')
    .factory('BannerService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'banner';
    var BannerService = {};

    BannerService.getBanners = function () {
        return $http.get(urlBase + '/index');
    };

    BannerService.createBanner = function (img,  cust) {
        return Upload.upload({
            url: urlBase + '/create',
            data: {
                data: cust,
                img: img
            },
        });
    };

    BannerService.updateBanner = function (img, cust) {
        return Upload.upload({
            url: urlBase + '/update/' + cust.id,
            data: {
                data: cust,
                img: img
            },
        });
    };

    BannerService.deleteBanner = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return BannerService;
}]);
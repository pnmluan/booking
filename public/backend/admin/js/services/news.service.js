angular.module('MetronicApp')
    .factory('NewsService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'news';
    var NewsService = {};

    NewsService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    NewsService.create = function (img,  cust) {
        return Upload.upload({
            url: urlBase + '/create',
            data: {
                data: cust,
                img: img
            },
        });
    };

    NewsService.update = function (img, cust) {
        return Upload.upload({
            url: urlBase + '/update/' + cust.id,
            data: {
                data: cust,
                img: img
            },
        });
    };

    NewsService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return NewsService;
}]);
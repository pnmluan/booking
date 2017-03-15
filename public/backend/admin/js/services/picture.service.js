angular.module('MetronicApp')
    .factory('PictureService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'picture';
    var PictureService = {};

    PictureService.getAll = function (params = null) {
        console.log(params);
        return $http.get(urlBase + '/index?' + params);
    };

    PictureService.save = function (imgs, cust, id = null) {
        if(id) {
            return Upload.upload({
                url: urlBase + '/save/' + cust.id,
                data: {
                    data: cust,
                    filepaths: imgs
                },
            });
        } else {
            return Upload.upload({
                url: urlBase + '/save',
                data: {
                    data: cust,
                    filepaths: imgs
                },
            });
        }
        
    };

    PictureService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return PictureService;
}]);
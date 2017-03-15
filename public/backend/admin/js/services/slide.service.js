angular.module('MetronicApp')
    .factory('SlideService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'slide';
    var SlideService = {};

    SlideService.getAll = function () {
        return $http.get(urlBase + '/index');
    };

    SlideService.save = function (img, cust, id = null) {
        if(id) {
            return Upload.upload({
                url: urlBase + '/save/' + cust.id,
                data: {
                    data: cust,
                    filepath: img
                },
            });
        } else {
            return Upload.upload({
                url: urlBase + '/save',
                data: {
                    data: cust,
                    filepath: img
                },
            });
        }
        
    };

    SlideService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return SlideService;
}]);
angular.module('MetronicApp')
    .factory('AlbumTicketService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'album_ticket';
    var service = {};

    service.getAll = function (params = null) {
        return $http.get(urlBase + '/index?'+ params);
    };

    service.save = function (imgs, cust, id = null) {
        if(id) {
            return Upload.upload({
                url: urlBase + '/save/' + cust.id,
                data: {
                    data: cust,
                    imgs: imgs
                },
            });
        } else {
            return Upload.upload({
                url: urlBase + '/save',
                data: {
                    data: cust,
                    imgs: imgs
                },
            });
        }
        
    };

    service.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return service;
}]);
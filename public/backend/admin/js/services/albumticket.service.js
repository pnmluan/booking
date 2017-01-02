angular.module('MetronicApp')
    .factory('AlbumTicketService', ['$http', '$rootScope', 'Upload', function($http, $rootScope, Upload) {

    var urlBase = $rootScope.settings.apiPath + 'album_ticket';
    var AlbumTicketService = {};

    AlbumTicketService.getAll = function (params = null) {
        return $http.get(urlBase + '/index?'+ params);
    };

    AlbumTicketService.create = function (imgs,  cust) {
        return Upload.upload({
            url: urlBase + '/create',
            data: {
                data: cust,
                imgs: imgs
            },
        });
    };

    AlbumTicketService.update = function (img, cust) {
        return Upload.upload({
            url: urlBase + '/update/' + cust.id,
            data: {
                data: cust,
                img: img
            },
        });
    };

    AlbumTicketService.delete = function (id) {
        return $http.delete(urlBase + '/delete/' + id);
    };

    return AlbumTicketService;
}]);
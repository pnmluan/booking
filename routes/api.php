<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$api = $app->make(Dingo\Api\Routing\Router::class);

$api->version('v1', function ($api) {
    $api->post('/auth/login', [
        'as' => 'api.auth.login',
        'uses' => 'App\Http\Controllers\Auth\AuthController@login',
    ]);

    $api->group([
        'middleware' => 'api.auth',
    ], function ($api) {
        $api->get('/', [
            'uses' => 'App\Http\Controllers\APIController@getIndex',
            'as' => 'api.index'
        ]);
        $api->get('/auth/user', [
            'uses' => 'App\Http\Controllers\Auth\AuthController@getUser',
            'as' => 'api.auth.user'
        ]);
        $api->patch('/auth/refresh', [
            'uses' => 'App\Http\Controllers\Auth\AuthController@patchRefresh',
            'as' => 'api.auth.refresh'
        ]);
        $api->delete('/auth/logout', [
            'uses' => 'App\Http\Controllers\Auth\AuthController@deleteInvalidate',
            'as' => 'api.auth.logout'
        ]);


        /*
        |--------------------------------------------------------------------------
        | Banner
        |--------------------------------------------------------------------------
        */
        $api->post('/banner/save', [
            'as' => 'api.banner.create',
            'uses' => 'App\Http\Controllers\System\BannerController@save',
        ]);

        $api->post('/banner/save/{id}', [
            'as' => 'api.banner.update',
            'uses' => 'App\Http\Controllers\System\BannerController@save',
        ]);

        $api->delete('/banner/delete/{id}', [
            'as' => 'api.banner.delete',
            'uses' => 'App\Http\Controllers\System\BannerController@delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Baggage Type
        |--------------------------------------------------------------------------
        */
        $api->post('/baggage_type/save', [
            'as' => 'api.baggagetype.create',
            'uses' => 'App\Http\Controllers\System\BaggageTypeController@save',
        ]);

        $api->post('/baggage_type/save/{id}', [
            'as' => 'api.baggagetype.update',
            'uses' => 'App\Http\Controllers\System\BaggageTypeController@save',
        ]);

        $api->delete('/baggage_type/delete/{id}', [
            'as' => 'api.baggagetype.delete',
            'uses' => 'App\Http\Controllers\System\BaggageTypeController@delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Booking
        |--------------------------------------------------------------------------
        */
        $api->post('/booking/save', [
            'as' => 'api.booking.create',
            'uses' => 'App\Http\Controllers\System\BookingController@save',
        ]);

        $api->post('/booking/save/{id}', [
            'as' => 'api.booking.update',
            'uses' => 'App\Http\Controllers\System\BookingController@save',
        ]);

        $api->delete('/booking/delete/{id}', [
            'as' => 'api.booking.delete',
            'uses' => 'App\Http\Controllers\System\BookingController@delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Category Ticket
        |--------------------------------------------------------------------------
        */
        $api->post('/category_ticket/save', [
            'as' => 'api.category_ticket.create',
            'uses' => 'App\Http\Controllers\System\CategoryTicketController@save',
        ]);

        $api->post('/category_ticket/save/{id}', [
            'as' => 'api.category_ticket.update',
            'uses' => 'App\Http\Controllers\System\CategoryTicketController@save',
        ]);

        $api->delete('/category_ticket/delete/{id}', [
            'as' => 'api.category_ticket.delete',
            'uses' => 'App\Http\Controllers\System\CategoryTicketController@delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Comment
        |--------------------------------------------------------------------------
        */
        $api->post('/comment/save', [
            'as' => 'api.comment.create',
            'uses' => 'App\Http\Controllers\System\CommentController@save',
        ]);

        $api->post('/comment/save/{id}', [
            'as' => 'api.comment.update',
            'uses' => 'App\Http\Controllers\System\CommentController@save',
        ]);

        $api->delete('/comment/delete/{id}', [
            'as' => 'api.comment.delete',
            'uses' => 'App\Http\Controllers\System\CommentController@delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Entrance Ticket
        |--------------------------------------------------------------------------
        */
        $api->post('/entrance_ticket/save', [
            'as' => 'api.entrance_ticket.create',
            'uses' => 'App\Http\Controllers\System\EntranceTicketController@save',
        ]);

        $api->post('/entrance_ticket/save/{id}', [
            'as' => 'api.entrance_ticket.update',
            'uses' => 'App\Http\Controllers\System\EntranceTicketController@save',
        ]);

        $api->delete('/entrance_ticket/delete/{id}', [
            'as' => 'api.entrance_ticket.delete',
            'uses' => 'App\Http\Controllers\System\EntranceTicketController@delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Location
        |--------------------------------------------------------------------------
        */
        $api->post('/location/save', [
            'as' => 'api.location.create',
            'uses' => 'App\Http\Controllers\System\LocationController@save',
        ]);

        $api->post('/location/save/{id}', [
            'as' => 'api.location.update',
            'uses' => 'App\Http\Controllers\System\LocationController@save',
        ]);

        $api->delete('/location/delete/{id}', [
            'as' => 'api.location.delete',
            'uses' => 'App\Http\Controllers\System\LocationController@delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | News
        |--------------------------------------------------------------------------
        */
        $api->post('/news/save', [
            'as' => 'api.news.create',
            'uses' => 'App\Http\Controllers\System\NewsController@save',
        ]);

        $api->post('/news/save/{id}', [
            'as' => 'api.news.update',
            'uses' => 'App\Http\Controllers\System\NewsController@save',
        ]);

        $api->delete('/news/delete/{id}', [
            'as' => 'api.news.delete',
            'uses' => 'App\Http\Controllers\System\NewsController@delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Provider
        |--------------------------------------------------------------------------
        */
        $api->post('/provider/save', [
            'as' => 'api.provider.create',
            'uses' => 'App\Http\Controllers\System\ProviderController@save',
        ]);

        $api->post('/provider/save/{id}', [
            'as' => 'api.provider.update',
            'uses' => 'App\Http\Controllers\System\ProviderController@save',
        ]);

        $api->delete('/provider/delete/{id}', [
            'as' => 'api.provider.delete',
            'uses' => 'App\Http\Controllers\System\ProviderController@delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Ticket Bill
        |--------------------------------------------------------------------------
        */
        $api->post('/ticket_bill/save', [
            'as' => 'api.ticket_bill.create',
            'uses' => 'App\Http\Controllers\System\TicketBillController@save',
        ]);

        $api->post('/ticket_bill/save/{id}', [
            'as' => 'api.ticket_bill.update',
            'uses' => 'App\Http\Controllers\System\TicketBillController@save',
        ]);

        $api->delete('/ticket_bill/delete/{id}', [
            'as' => 'api.ticket_bill.delete',
            'uses' => 'App\Http\Controllers\System\TicketBillController@delete',
        ]);
    });

    

    /*
    |--------------------------------------------------------------------------
    | User
    |--------------------------------------------------------------------------
    */
    $api->get('/user/index', [
        'as' => 'api.user.index',
        'uses' => 'App\Http\Controllers\System\UserController@index',
    ]);

    $api->get('/user/show/{id}', [
        'as' => 'api.user.show',
        'uses' => 'App\Http\Controllers\System\UserController@show',
    ]);



    /*
    |--------------------------------------------------------------------------
    | Mail
    |--------------------------------------------------------------------------
    */
    $api->post('mail/sendInfoPayment','MailController@sendInfoPayment');
    $api->post('mail/sendEntranceTicketPayment','MailController@sendEntranceTicketPayment');

    /*
    |--------------------------------------------------------------------------
    | Banner
    |--------------------------------------------------------------------------
    */

    $api->get('/banner/index', [
        'as' => 'api.banner.index',
        'uses' => 'App\Http\Controllers\System\BannerController@index',
    ]);

    $api->get('/banner/show/{id}', [
        'as' => 'api.banner.show',
        'uses' => 'App\Http\Controllers\System\BannerController@show',
    ]);


    /*
    |--------------------------------------------------------------------------
    | News
    |--------------------------------------------------------------------------
    */
    $api->get('/news/index', [
        'as' => 'api.news.index',
        'uses' => 'App\Http\Controllers\System\NewsController@index',
    ]);

    $api->get('/news/show/{id}', [
        'as' => 'api.news.show',
        'uses' => 'App\Http\Controllers\System\NewsController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Comment
    |--------------------------------------------------------------------------
    */
    $api->get('/comment/index', [
        'as' => 'api.comment.index',
        'uses' => 'App\Http\Controllers\System\CommentController@index',
    ]);

    $api->get('/comment/show/{id}', [
        'as' => 'api.comment.show',
        'uses' => 'App\Http\Controllers\System\CommentController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Location
    |--------------------------------------------------------------------------
    */
    $api->get('/location/index', [
        'as' => 'api.location.index',
        'uses' => 'App\Http\Controllers\System\LocationController@index',
    ]);

    $api->get('/location/show/{id}', [
        'as' => 'api.location.show',
        'uses' => 'App\Http\Controllers\System\LocationController@show',
    ]);
    
    /*
   |--------------------------------------------------------------------------
   | Provider
   |--------------------------------------------------------------------------
   */
   $api->get('/provider/index', [
        'as' => 'api.provider.index',
        'uses' => 'App\Http\Controllers\System\ProviderController@index',
    ]);

    $api->get('/provider/show/{id}', [
        'as' => 'api.provider.show',
        'uses' => 'App\Http\Controllers\System\ProviderController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | TicketType
    |--------------------------------------------------------------------------
    */
    $api->get('/ticket_type/index', [
        'as' => 'api.ticket_type.index',
        'uses' => 'App\Http\Controllers\System\TicketTypeController@index',
    ]);

    $api->get('/ticket_type/show/{id}', [
        'as' => 'api.ticket_type.show',
        'uses' => 'App\Http\Controllers\System\TicketTypeController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | BaggageType
    |--------------------------------------------------------------------------
    */
    $api->get('/baggagetype/index', [
        'as' => 'api.baggagetype.index',
        'uses' => 'App\Http\Controllers\System\BaggageTypeController@index',
    ]);

    $api->get('/baggagetype/show/{id}', [
        'as' => 'api.baggagetype.show',
        'uses' => 'App\Http\Controllers\System\BaggageTypeController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Booking
    |--------------------------------------------------------------------------
    */
    $api->get('/booking/index', [
        'as' => 'api.booking.index',
        'uses' => 'App\Http\Controllers\System\BookingController@index',
    ]);

    $api->get('/booking/show/{id}', [
        'as' => 'api.booking.show',
        'uses' => 'App\Http\Controllers\System\BookingController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | BookingDetail
    |--------------------------------------------------------------------------
    */
    $api->get('/booking_detail/index', [
        'as' => 'api.booking_detail.index',
        'uses' => 'App\Http\Controllers\System\BookingDetailController@index',
    ]);

    $api->get('/booking_detail/show/{id}', [
        'as' => 'api.booking_detail.show',
        'uses' => 'App\Http\Controllers\System\BookingDetailController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Contact
    |--------------------------------------------------------------------------
    */
    $api->get('/contact/index', [
        'as' => 'api.contact.index',
        'uses' => 'App\Http\Controllers\System\ContactController@index',
    ]);

    $api->get('/contact/show/{id}', [
        'as' => 'api.contact.show',
        'uses' => 'App\Http\Controllers\System\ContactController@show',
    ]);


    /*
    |--------------------------------------------------------------------------
    | Passenger
    |--------------------------------------------------------------------------
    */
    $api->get('/passenger/index', [
        'as' => 'api.passenger.index',
        'uses' => 'App\Http\Controllers\System\PassengerController@index',
    ]);

    $api->get('/passenger/show/{id}', [
        'as' => 'api.passenger.show',
        'uses' => 'App\Http\Controllers\System\PassengerController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Fare
    |--------------------------------------------------------------------------
    */
    $api->get('/fare/index', [
        'as' => 'api.fare.index',
        'uses' => 'App\Http\Controllers\System\FareController@index',
    ]);

    $api->get('/fare/show/{id}', [
        'as' => 'api.fare.show',
        'uses' => 'App\Http\Controllers\System\FareController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Category Ticket
    |--------------------------------------------------------------------------
    */
    $api->get('/category_ticket/index', [
        'as' => 'api.category_ticket.index',
        'uses' => 'App\Http\Controllers\System\CategoryTicketController@index',
    ]);

    $api->get('/category_ticket/show/{id}', [
        'as' => 'api.category_ticket.show',
        'uses' => 'App\Http\Controllers\System\CategoryTicketController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Entrance Ticket
    |--------------------------------------------------------------------------
    */
    $api->get('/entrance_ticket/index', [
        'as' => 'api.entrance_ticket.index',
        'uses' => 'App\Http\Controllers\System\EntranceTicketController@index',
    ]);

    $api->get('/entrance_ticket/show/{id}', [
        'as' => 'api.entrance_ticket.show',
        'uses' => 'App\Http\Controllers\System\EntranceTicketController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Ticket Bill
    |--------------------------------------------------------------------------
    */
    $api->get('/ticket_bill/index', [
        'as' => 'api.ticket_bill.index',
        'uses' => 'App\Http\Controllers\System\TicketBillController@index',
    ]);

    $api->get('/ticket_bill/show/{id}', [
        'as' => 'api.ticket_bill.show',
        'uses' => 'App\Http\Controllers\System\TicketBillController@show',
    ]);


    /*
    |--------------------------------------------------------------------------
    | Ticket Detail
    |--------------------------------------------------------------------------
    */
    $api->get('/ticket_detail/index', [
        'as' => 'api.ticket_detail.index',
        'uses' => 'App\Http\Controllers\System\TicketDetailController@index',
    ]);

    $api->get('/ticket_detail/show/{id}', [
        'as' => 'api.ticket_detail.show',
        'uses' => 'App\Http\Controllers\System\TicketDetailController@show',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Crawler API
    |--------------------------------------------------------------------------
    */
    $api->post('/airline/vietjet', [
        'as' => 'api.airline.vietjet',
        'uses' => 'App\Http\Controllers\TicketCrawlers\AirlineController@vietjet',
    ]);

    $api->post('/airline/jetstar', [
        'as' => 'api.airline.jetstar',
        'uses' => 'App\Http\Controllers\TicketCrawlers\AirlineController@jetstar',
    ]);

    $api->post('/airline/vna', [
        'as' => 'api.airline.vna',
        'uses' => 'App\Http\Controllers\TicketCrawlers\AirlineController@vna',
    ]);
    
});

    

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

$app->get('/', function () use ($app) {
    return $app->version();
});
// 'middleware' => 'BasicAuth',
$app->group(['prefix' => 'api/v1',   'namespace' => 'App\Http\Controllers'], function($app)
{
    /*
	|--------------------------------------------------------------------------
	| Banner
	|--------------------------------------------------------------------------
	*/
    $app->post('mail/send','MailController@send');

	/*
	|--------------------------------------------------------------------------
	| Banner
	|--------------------------------------------------------------------------
	*/
    $app->get('banner/index','BannerController@index');

    $app->get('banner/show/{id}','BannerController@show');

    $app->post('banner/create','BannerController@create');

    $app->post('banner/update/{id}','BannerController@update');

    $app->delete('banner/delete/{id}','BannerController@delete');


    /*
    |--------------------------------------------------------------------------
    | News
    |--------------------------------------------------------------------------
    */
    $app->get('news/index','NewsController@index');

    $app->get('news/show/{id}','NewsController@show');

    $app->post('news/create','NewsController@create');

    $app->post('news/update/{id}','NewsController@update');

    $app->delete('news/delete/{id}','NewsController@delete');

    /*
	|--------------------------------------------------------------------------
	| Comment
	|--------------------------------------------------------------------------
	*/
    $app->get('comment/index','CommentController@index');

    $app->get('comment/show/{id}','CommentController@show');

    $app->post('comment/create','CommentController@create');

    $app->post('comment/update/{id}','CommentController@update');

    $app->delete('comment/delete/{id}','CommentController@delete');

    /*
    |--------------------------------------------------------------------------
    | Location
    |--------------------------------------------------------------------------
    */
    $app->get('location/index','LocationController@index');

    $app->get('location/show/{id}','LocationController@show');

    $app->post('location/create','LocationController@create');

    $app->put('location/update/{id}','LocationController@update');

    $app->delete('location/delete/{id}','LocationController@delete');
    
    /*
   |--------------------------------------------------------------------------
   | Provider
   |--------------------------------------------------------------------------
   */
    $app->get('provider','ProviderController@index');

    $app->get('provider/show/{id}','ProviderController@show');

    $app->post('provider/create','ProviderController@create');

    $app->put('provider/update/{id}','ProviderController@update');

    $app->delete('provider/delete/{id}','ProviderController@delete');

    /*
    |--------------------------------------------------------------------------
    | TicketType
    |--------------------------------------------------------------------------
    */
    $app->get('ticket_type','TicketTypeController@index');

    $app->get('ticket_type/show/{id}','TicketTypeController@show');

    $app->post('ticket_type/create','TicketTypeController@create');

    $app->put('ticket_type/update/{id}','TicketTypeController@update');

    $app->delete('ticket_type/delete/{id}','TicketTypeController@delete');

    /*
    |--------------------------------------------------------------------------
    | BaggageType
    |--------------------------------------------------------------------------
    */
    $app->get('baggagetype/index','BaggageTypeController@index');

    $app->get('baggagetype/show/{id}','BaggageTypeController@show');

    $app->post('baggagetype/create','BaggageTypeController@create');

    $app->put('baggagetype/update/{id}','BaggageTypeController@update');

    $app->delete('baggagetype/delete/{id}','BaggageTypeController@delete');

    

    /*
    |--------------------------------------------------------------------------
    | Booking
    |--------------------------------------------------------------------------
    */
    $app->get('booking/index','BookingController@index');

    $app->get('booking/show/{id}','BookingController@show');

    $app->post('booking/create','BookingController@create');

    $app->put('booking/update/{id}','BookingController@update');

    $app->delete('booking/delete/{id}','BookingController@delete');

    /*
    |--------------------------------------------------------------------------
    | BookingDetail
    |--------------------------------------------------------------------------
    */
    $app->get('booking_detail','BookingDetailController@index');

    $app->get('booking_detail/show/{id}','BookingDetailController@show');

    $app->post('booking_detail/create','BookingDetailController@create');

    $app->put('booking_detail/update/{id}','BookingDetailController@update');

    $app->delete('booking_detail/delete/{id}','BookingDetailController@delete');

    /*
    |--------------------------------------------------------------------------
    | Contact
    |--------------------------------------------------------------------------
    */
    $app->get('contact','ContactController@index');

    $app->get('contact/show/{id}','ContactController@show');

    $app->post('contact/create','ContactController@create');

    $app->put('contact/update/{id}','ContactController@update');

    $app->delete('contact/delete/{id}','ContactController@delete');


    /*
    |--------------------------------------------------------------------------
    | Passenger
    |--------------------------------------------------------------------------
    */
    $app->get('passenger','PassengerController@index');

    $app->get('passenger/show/{id}','PassengerController@show');

    $app->post('passenger/create','PassengerController@create');

    $app->put('passenger/update/{id}','PassengerController@update');

    $app->delete('passenger/delete/{id}','PassengerController@delete');

    /*
    |--------------------------------------------------------------------------
    | Fare
    |--------------------------------------------------------------------------
    */
    $app->get('fare','FareController@index');

    $app->get('fare/show/{id}','FareController@show');

    $app->post('fare/create','FareController@create');

    $app->put('fare/update/{id}','FareController@update');

    $app->delete('fare/delete/{id}','FareController@delete');

    /*
    |--------------------------------------------------------------------------
    | Category Ticket
    |--------------------------------------------------------------------------
    */
    $app->get('category_ticket/index','CategoryTicketController@index');

    $app->get('category_ticket/show/{id}','CategoryTicketController@show');

    $app->post('category_ticket/create','CategoryTicketController@create');

    $app->put('category_ticket/update/{id}','CategoryTicketController@update');

    $app->delete('category_ticket/delete/{id}','CategoryTicketController@delete');

    /*
    |--------------------------------------------------------------------------
    | Entrance Ticket
    |--------------------------------------------------------------------------
    */
    $app->get('entrance_ticket/index','EntranceTicketController@index');

    $app->get('entrance_ticket/show/{id}','EntranceTicketController@show');

    $app->post('entrance_ticket/create','EntranceTicketController@create');

    $app->put('entrance_ticket/update/{id}','EntranceTicketController@update');

    $app->delete('entrance_ticket/delete/{id}','EntranceTicketController@delete');

    /*
    |--------------------------------------------------------------------------
    | Ticket Bill
    |--------------------------------------------------------------------------
    */
    $app->get('ticket_bill/index','TicketBillController@index');

    $app->get('ticket_bill/show/{id}','TicketBillController@show');

    $app->post('ticket_bill/create','TicketBillController@create');

    $app->put('ticket_bill/update/{id}','TicketBillController@update');

    $app->delete('ticket_bill/delete/{id}','TicketBillController@delete');

    /*
    |--------------------------------------------------------------------------
    | Album Ticket
    |--------------------------------------------------------------------------
    */
    $app->get('album_ticket/index','AlbumTicketController@index');

    $app->get('album_ticket/show/{id}','AlbumTicketController@show');

    $app->post('album_ticket/create','AlbumTicketController@create');

    $app->put('album_ticket/update/{id}','AlbumTicketController@update');

    $app->delete('album_ticket/delete/{id}','AlbumTicketController@delete');
});

// Crawler API
$app->group(['prefix' => 'api/v1',  'namespace' => 'App\Http\Controllers'], function($app)
{
    $app->get('airline','TicketCrawlers\AirlineController@index');

    $app->get('airline/test','TicketCrawlers\AirlineController@test');

    $app->post('airline/vietjet','TicketCrawlers\AirlineController@vietjet');

    $app->post('airline/jetstar','TicketCrawlers\AirlineController@jetstar');

    $app->post('airline/vna','TicketCrawlers\AirlineController@vna');

});

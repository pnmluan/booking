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

$app->group(['prefix' => 'api/v1', 'middleware' => 'BasicAuth',  'namespace' => 'App\Http\Controllers'], function($app)
{
	/*
	|--------------------------------------------------------------------------
	| Banner
	|--------------------------------------------------------------------------
	*/
    $app->get('banner','BannerController@index');

    $app->get('banner/{id}','BannerController@show');

    $app->post('banner','BannerController@create');

    $app->put('banner/{id}','BannerController@update');

    $app->delete('banner/{id}','BannerController@delete');

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
    $app->get('baggage_type','BaggageTypeController@index');

    $app->get('baggage_type/show/{id}','BaggageTypeController@show');

    $app->post('baggage_type/create','BaggageTypeController@create');

    $app->put('baggage_type/update/{id}','BaggageTypeController@update');

    $app->delete('baggage_type/delete/{id}','BaggageTypeController@delete');

    /*
    |--------------------------------------------------------------------------
    | Booking
    |--------------------------------------------------------------------------
    */
    $app->get('booking','BookingController@index');

    $app->get('booking/show/{id}','BookingController@show');

    $app->post('booking/create','BookingController@create');

    $app->put('booking/update/{id}','BookingController@update');

    $app->delete('booking/delete/{id}','BookingController@delete');
});

// Crawler API
$app->group(['prefix' => 'api/v1', 'middleware' => 'BasicAuth', 'namespace' => 'App\Http\Controllers'], function($app)
{
    $app->get('airline','TicketCrawlers\AirlineController@index');

    $app->get('airline/test','TicketCrawlers\AirlineController@test');

    $app->post('airline/vietjet','TicketCrawlers\AirlineController@vietjet');

    $app->post('airline/jetstar','TicketCrawlers\AirlineController@jetstar');

});

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
    $app->get('banner/index','BannerController@index');

    $app->get('banner/show/{id}','BannerController@show');

    $app->post('banner/create','BannerController@create');

    $app->post('banner/update/{id}','BannerController@update');

    $app->delete('banner/delete/{id}','BannerController@delete');

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
    | Booking
    |--------------------------------------------------------------------------
    */
    $app->get('booking','BookingController@index');

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
});

// Crawler API
$app->group(['prefix' => 'api/v1', 'middleware' => 'BasicAuth', 'namespace' => 'App\Http\Controllers'], function($app)
{
    $app->get('airline','TicketCrawlers\AirlineController@index');

    $app->get('airline/test','TicketCrawlers\AirlineController@test');

    $app->post('airline/vietjet','TicketCrawlers\AirlineController@vietjet');

    $app->post('airline/jetstar','TicketCrawlers\AirlineController@jetstar');

});

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

$app->group(['prefix' => 'api/v1', 'middleware' => 'BasicAuth', 'namespace' => 'App\Http\Controllers'], function($app)
{
	/*
	|--------------------------------------------------------------------------
	| Banner
	|--------------------------------------------------------------------------
	*/
    $app->get('banner','BannerController@index');

    $app->get('banner/{id}','BannerController@getbanner');

    $app->post('banner','BannerController@createbanner');

    $app->put('banner/{id}','BannerController@updatebanner');

    $app->delete('banner/{id}','BannerController@deletebanner');

    /*
	|--------------------------------------------------------------------------
	| Comment
	|--------------------------------------------------------------------------
	*/
    $app->get('comment','CommentController@index');

    $app->get('comment/{id}','CommentController@getcomment');
});

// Crawler API
$app->group(['prefix' => 'api/v1', 'middleware' => 'BasicAuth', 'namespace' => 'App\Http\Controllers'], function($app)
{
    $app->get('airline','TicketCrawlers\AirlineController@index');

});

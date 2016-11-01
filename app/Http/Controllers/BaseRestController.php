<?php
namespace TmrLumenAPI\Base\Http\Controllers;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Validator;
use TmrLumenAPI\Base\Helpers\QueryHelper;
use TmrLumenAPI\Base\Libraries\Constants;
abstract class BaseRestController extends BaseController
{
	const RESPONSE_OK = ['status' => 200, 'message' => 'OK'];
	const RESPONSE_BAD_REQUEST = ['status' => 400, 'message' => 'BAD_REQUEST'];
	const RESPONSE_UNAUTHORIZED = ['status' => 401, 'message' => 'UNAUTHORIZED'];
	const RESPONSE_FORBIDDEN = ['status' => 403, 'message' => 'FORBIDDEN'];
	const RESPONSE_NOT_FOUND = ['status' => 404, 'message' => 'NOT_FOUND'];
	const RESPONSE_KO = ['status' => 500, 'message' => 'KO'];
	const GET_ALL_ROUTE_NAME = 'get_all';
	const GET_ROUTE_NAME = 'get';
	const CREATE_ROUTE_NAME = 'create';
	const UPDATE_ROUTE_NAME = 'update';
	const DELETE_ROUTE_NAME = 'delete';
	const API_VERSION = 1;
    static protected function __getModelClass()
    {
    	throw new \LogicException('Class ' . get_called_class() . ' should implement static protected method __getModelClass');
    }
    static protected function __getRoutePrefix()
    {
    	throw new \LogicException('Class ' . get_called_class() . ' should implement static protected method __getRoutePrefix');
    }
    static protected function __getRoutes()
    {
    	return [
    		'get_all' => [
    			'route' => '/', 'method' => 'get', 'action' => 'getAll',
			],
    		'get' => [
    			'route' => '/{id:'.Constants::UUID_V4_REGEX.'}',
    			'method' => 'get', 'action' => 'get',
			],
    		'create' => [
    			'route' => '/', 'method' => 'post', 'action' => 'create',
			],
    		'update' => [
    			'route' => '/{id:'.Constants::UUID_V4_REGEX.'}',
    			'method' => 'patch', 'action' => 'update',
			],
    		'delete' => [
    			'route' => '/{id:'.Constants::UUID_V4_REGEX.'}',
    			'method' => 'delete', 'action' => 'delete',
			]
    	];
    }
    static protected function __getDefaultMiddleware()
    {
    	return [];
    }
    static public function registerRoutes($app)
    {
    	$prefix = (static::API_VERSION ? 'api/v' . static::API_VERSION : '');
    	$prefix.= '/' . static::__getRoutePrefix();
    	$app->group([
    		'prefix' => trim($prefix, ' /')
		], function() use ($app, $prefix) {
			$routePrefixSnakeCase = str_replace('/', '_', $prefix);
			foreach (static::__getRoutes() as $routeName => $route) {
				$app->{$route['method']}($route['route'], [
					'as' => trim($routeName . '_' . $routePrefixSnakeCase, ' _'),
					'uses' => get_called_class() . '@' . $route['action'],
					'middleware' => array_merge(
						!isset($route['ignoreDefaultMiddleware']) || !$route['ignoreDefaultMiddleware']
							? static::__getDefaultMiddleware()
							: [],
						isset($route['middleware']) && is_array($route['middleware'])
							? $route['middleware']
							: []
					)
				]);
			}
		});
    }
    public function getAll(Request $request)
    {
    	$modelClass = static::__getModelClass();
    	$query = $modelClass::query();
    	if (is_array($with = json_decode($request->query('with', null)))) {
    		$query->with($with);
    	}
    	if (is_array($where = json_decode($request->query('where', null)))) {
    		QueryHelper::addWhereToQueryBuilder($query, $where);
    	}
    	$count = $query->count();
    	$limit = (int) $request->query('limit', 25);
    	if (!is_numeric($limit) || $limit < 1) {
    		$limit = 25;
    	}
    	$lastPage = ceil($count/$limit);
    	$page = (int) $request->query('page', 1);
    	if (!is_numeric($page) || $page < 1) {
    		$page = 1;
    	} else if ($page > $lastPage) {
    		$page = $lastPage;
    	}
    	$extra = ['summary' => [
			'total_count' => $count,
			'limit' => $limit,
			'page' => $page,
			'total_pages' => $lastPage,
			'current_page_uri' => $request->path() . '?' . http_build_query(array_merge($request->query(), ['limit' => $limit, 'page' => $page])),
			'first_page_uri' => $request->path() . '?' . http_build_query(array_merge($request->query(), ['limit' => $limit, 'page' => 1])),
			'last_page_uri' => $request->path() . '?' . http_build_query(array_merge($request->query(), ['limit' => $limit, 'page' => $lastPage])),
			'previous_page_uri' => $page > 1 ? ($request->path() . '?' . http_build_query(array_merge($request->query(), ['limit' => $limit, 'page' => $page-1]))) : null,
			'next_page_uri' => $page < $lastPage ? ($request->path() . '?' . http_build_query(array_merge($request->query(), ['limit' => $limit, 'page' => $page+1]))) : null,
		]];
		$query->skip(($page-1)*$limit)->take($limit);
		try {
			$results = $query->get();
		} catch (\Exception $ex) {
			return self::responseKO(self::RESPONSE_KO, [$ex->getMessage()]);
		}
    	return self::responseOK($results, $extra);
    }
    public function get(Request $request, $id)
    {
    	$modelClass = static::__getModelClass();
    	try {
    		if (is_array($with = json_decode($request->query('with', null)))) {
	    		$model = $modelClass::with($with)->find($id);
	    	} else {
	    		$model = $modelClass::find($id);
	    	}
    	} catch (\Exception $ex) {
			return self::responseKO(self::RESPONSE_KO, [$ex->getMessage()]);
		}
    	if (!$model) {
    		return self::responseKO(self::RESPONSE_NOT_FOUND);
    	}
    	return self::responseOK($model);
    }
    public function create(Request $request)
    {
    	$modelClass = static::__getModelClass();
    	$data = $request->json()->all();
    	$model = new $modelClass();
    	$model->fill($data);
    	$model->fillDefaultValues();
    	if (!$model->isValid()) {
    		return self::responseKO(self::RESPONSE_BAD_REQUEST, [$model->getValidationErrors()]);
    	}
    	try {
    		$model->save();
    	} catch (\Exception $ex) {
			return self::responseKO(self::RESPONSE_KO, [$ex->getMessage()]);
    	}
    	return self::responseOK($model);
    }
    public function update(Request $request, $id)
    {
    	$modelClass = static::__getModelClass();
    	$model = $modelClass::find($id);
    	if (!$model) {
    		return self::responseKO(self::RESPONSE_NOT_FOUND);
    	}
    	$data = $request->json()->all();
    	$model->fill($data);
    	if (!$model->isValid()) {
    		return self::responseKO(self::RESPONSE_BAD_REQUEST, [$model->getValidationErrors()]);
    	}
    	try {
    		$model->save();
    	} catch (\Exception $ex) {
			return self::responseKO(self::RESPONSE_KO, [$ex->getMessage()]);
    	}
    	return self::responseOK($model);
    }
    public function delete(Request $request, $id)
    {
    	$modelClass = static::__getModelClass();
    	$model = $modelClass::find($id);
    	if (!$model) {
    		return self::responseKO(self::RESPONSE_NOT_FOUND);
    	}
    	try {
    		if (!$model->delete()) {
    			return self::responseKO(self::RESPONSE_KO, []);
    		}
    	} catch (\Exception $ex) {
    		return self::responseKO(self::RESPONSE_KO, [$ex->getMessage()]);
    	}
    	return self::responseOK();
    }
    public static function responseOK($data = null, array $extra = [])
    {
    	return self::response(self::RESPONSE_OK, array_merge(['data' => $data], $extra));
    }
    public static function responseKO(array $status = self::RESPONE_KO, array $errors = [])
    {
    	return self::response($status, ['errors' => $errors, 'data' => null]);
    }
    public static function response(array $status, array $body = null)
    {
    	$response = response()
    		->json(array_merge($status, $body ? $body : []))
    		->setStatusCode($status['status'], $status['message']);
		$headers = $response->headers;
    	$headers->set('Access-Control-Allow-Origin', '*');
    	$headers->set('Allow', 'GET, POST, PATCH, DELETE, OPTIONS');
    	return $response;
    }
}
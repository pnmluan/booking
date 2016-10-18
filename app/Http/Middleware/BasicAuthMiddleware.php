<?php

namespace App\Http\Middleware;

use Closure;

class BasicAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        if($request->getUser() != env('API_USERNAME') || $request->getPassword() != env('API_PASSWORD')) {
            $headers = array('WWW-Authenticate' => 'Basic');
            return response('Wrong Authentication API', 401, $headers);
        }
        return $next($request);
    }
}
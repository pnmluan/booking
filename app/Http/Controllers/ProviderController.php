<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 9:07 AM
 */

namespace App\Http\Controllers;


use App\Models\Provider;

class ProviderController extends ApiController
{
    public function index(){
        $providers  = Provider::all();

        return response()->json($providers);

    }

    public function show($id){

        $provider  = Provider::find($id);

        return response()->json($provider);
    }

    public function create(Request $request){

        $provider = Provider::create($request->all());

        return response()->json($provider);

    }

    public function delete($id){
        $provider  = Provider::find($id);
        $provider->delete();

        return response()->json('deleted');
    }

    public function update(Request $request,$id){
        $provider  = Provider::find($id);
        $provider->name = $request->input('name');
        $provider->save();

        return response()->json($provider);
    }
}
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
        $Categories  = Provider::all();

        return response()->json($Categories);

    }

    public function show($id){

        $Provider  = Provider::find($id);

        return response()->json($Provider);
    }

    public function create(Request $request){

        $Provider = Provider::create($request->all());

        return response()->json($Provider);

    }

    public function delete($id){
        $Provider  = Provider::find($id);
        $Provider->delete();

        return response()->json('deleted');
    }

    public function update(Request $request,$id){
        $provider  = Provider::find($id);
        $provider->name = $request->input('name');
        $provider->save();

        return response()->json($provider);
    }
}
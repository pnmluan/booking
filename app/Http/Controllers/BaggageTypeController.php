<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 10:21 PM
 */

namespace App\Http\Controllers;


use App\Models\BaggageType;

class BaggageTypeController extends ApiController
{
    public function index(){
        $baggageTypes  = BaggageType::all();

        return response()->json($baggageTypes);

    }

    public function show($id){

        $baggageType  = BaggageType::find($id);

        return response()->json($baggageType);
    }

    public function create(Request $request){

        $baggageType = BaggageType::create($request->all());

        return response()->json($baggageType);

    }

    public function delete($id){
        $baggageType  = BaggageType::find($id);
        $baggageType->delete();

        return response()->json('deleted');
    }

    public function update(Request $request,$id){
        $baggage  = BaggageType::find($id);
        $baggage->name = $request->input('name');
        $baggage->save();

        return response()->json($baggage);
    }
}
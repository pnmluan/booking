<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 10:21 PM
 */

namespace App\Http\Controllers;


use App\Models\BaggageType;
use Illuminate\Http\Request;

class BaggageTypeController extends ApiController
{
    public function index(Request $request){

        $data = BaggageType::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $baggageType  = BaggageType::find($id);

        if (!$baggageType) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$baggageType]);
    }

    public function create(Request $request){
        $baggageType = new BaggageType();
        $data = $request->all();

        $baggageType->fill($data);

        if (!$baggageType->isValid()) {
            return $this->respondWithError(['error' => $baggageType->getValidationErrors()]);
        }
        try {
            $baggageType->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$baggageType]);
    }

    public function delete($id){

        $baggageType  = BaggageType::find($id);
        if (!$baggageType) {
            return $this->respondNotFound();
        }
        try {
            if (!$baggageType->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $baggageType = BaggageType::find($id);
        if(!$baggageType) {
            return $this->respondNotFound();
        }
        $data = $request->all();

        $baggageType->fill($data);

        if (!$baggageType->isValid()) {
            return $this->respondWithError(['error' => $baggageType->getValidationErrors()]);
        }
        try {
            $baggageType->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$baggageType]);
    }
}
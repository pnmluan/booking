<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class LocationController extends ApiController{

    public function index(Request $request){
        $data = Location::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $location  = Location::find($id);

        if (!$location) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$location]);
    }

    public function create(Request $request){
        $location = new Location();
        $data = $request->all();
        $location->fill($data);

        if (!$location->isValid()) {
            return $this->respondWithError(['error' => $location->getValidationErrors()]);
        }
        try {
            $location->save();
        } catch (\Exception $ex) {
            var_dump($ex);die;
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$location]);
    }

    public function delete($id){

        $location  = Location::find($id);
        if (!$location) {
            return $this->respondNotFound();
        }
        try {
            if (!$location->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $location = Location::find($id);
        if(!$location) {
            return $this->respondNotFound();
        }
        $data = $request->all();
        $location->fill($data);

        if (!$location->isValid()) {
            return $this->respondWithError(['error' => $location->getValidationErrors()]);
        }
        try {
            $location->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$location]);
    }
}
?>
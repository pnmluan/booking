<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 19-Nov-16
 * Time: 8:37 AM
 */

namespace App\Http\Controllers;

use App\Models\Fare;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FareController extends ApiController
{
    public function index(Request $request){

        $data = Fare::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $fare  = Fare::find($id);

        if (!$fare) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$fare]);
    }

    public function create(Request $request){
        $fare = new Fare();
        $data = $request->all();

        $fare->fill($data);

        if (!$fare->isValid()) {
            return $this->respondWithError(['error' => $fare->getValidationErrors()]);
        }
        try {
            $fare->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$fare]);
    }

    public function delete($id){

        $fare  = Fare::find($id);
        if (!$fare) {
            return $this->respondNotFound();
        }
        try {
            if (!$fare->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $fare = Fare::find($id);
        if(!$fare) {
            return $this->respondNotFound();
        }
        $data = $request->all();

        $fare->fill($data);

        if (!$fare->isValid()) {
            return $this->respondWithError(['error' => $fare->getValidationErrors()]);
        }
        try {
            $fare->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$fare]);
    }
}
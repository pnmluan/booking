<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 19-Nov-16
 * Time: 8:30 AM
 */

namespace App\Http\Controllers;

use App\Models\Passenger;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class PassengerController extends ApiController
{
    public function index(Request $request){

        $data = Passenger::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $passenger  = Passenger::find($id);

        if (!$passenger) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$passenger]);
    }

    public function create(Request $request){
        $passenger = new Passenger();
        $data = $request['data'];

        $passenger->fill($data);

        if (!$passenger->isValid()) {
            return $this->respondWithError(['error' => $passenger->getValidationErrors()]);
        }
        try {
            $passenger->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$passenger]);
    }

    public function delete($id){

        $passenger  = Passenger::find($id);
        if (!$passenger) {
            return $this->respondNotFound();
        }
        try {
            if (!$passenger->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $passenger = Passenger::find($id);
        if(!$passenger) {
            return $this->respondNotFound();
        }
        $data = $request['data'];

        $passenger->fill($data);

        if (!$passenger->isValid()) {
            return $this->respondWithError(['error' => $passenger->getValidationErrors()]);
        }
        try {
            $passenger->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$passenger]);
    }
}
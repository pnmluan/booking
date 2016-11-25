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

        $contact  = BaggageType::find($id);

        if (!$contact) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$contact]);
    }

    public function create(Request $request){
        $contact = new BaggageType();
        $data = $request['data'];

        $contact->fill($data);

        if (!$contact->isValid()) {
            return $this->respondWithError(['error' => $contact->getValidationErrors()]);
        }
        try {
            $contact->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$contact]);
    }

    public function delete($id){

        $contact  = BaggageType::find($id);
        if (!$contact) {
            return $this->respondNotFound();
        }
        try {
            if (!$contact->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $contact = BaggageType::find($id);
        if(!$contact) {
            return $this->respondNotFound();
        }
        $data = $request['data'];

        $contact->fill($data);

        if (!$contact->isValid()) {
            return $this->respondWithError(['error' => $contact->getValidationErrors()]);
        }
        try {
            $contact->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$contact]);
    }
}
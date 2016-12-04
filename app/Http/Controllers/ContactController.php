<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 19-Nov-16
 * Time: 8:18 AM
 */

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class ContactController extends ApiController
{
    public function index(Request $request){

        $data = Contact::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $contact  = Contact::find($id);

        if (!$contact) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$contact]);
    }

    public function create(Request $request){
        $contact = new Contact();
        $data = $request->all();

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

        $contact  = Contact::find($id);
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

        $contact = Contact::find($id);
        if(!$contact) {
            return $this->respondNotFound();
        }
        $data = $request->all();

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
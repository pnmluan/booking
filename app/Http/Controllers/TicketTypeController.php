<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 10:45 AM
 */

namespace App\Http\Controllers;


use App\Models\TicketType;
use Illuminate\Http\Request;

class TicketTypeController extends ApiController
{
    public function index(Request $request){

        $data = TicketType::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $ticketType  = TicketType::find($id);

        if (!$ticketType) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$ticketType]);
    }

    public function create(Request $request){
        $ticketType = new TicketType();
        $data = $request['data'];

        $ticketType->fill($data);

        if (!$ticketType->isValid()) {
            return $this->respondWithError(['error' => $ticketType->getValidationErrors()]);
        }
        try {
            $ticketType->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$ticketType]);
    }

    public function delete($id){

        $ticketType  = TicketType::find($id);
        if (!$ticketType) {
            return $this->respondNotFound();
        }
        try {
            if (!$ticketType->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $ticketType = TicketType::find($id);
        if(!$ticketType) {
            return $this->respondNotFound();
        }
        $data = $request['data'];

        $ticketType->fill($data);

        if (!$ticketType->isValid()) {
            return $this->respondWithError(['error' => $ticketType->getValidationErrors()]);
        }
        try {
            $ticketType->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$ticketType]);
    }
}
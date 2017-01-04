<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 10:21 PM
 */

namespace App\Http\Controllers;


use App\Models\TicketDetail;
use Illuminate\Http\Request;

class TicketDetailController extends ApiController
{
    public function index(Request $request){

        $data = TicketDetail::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $ticketDetail  = TicketDetail::find($id);

        if (!$ticketDetail) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$ticketDetail]);
    }

    public function create(Request $request){
        $ticketDetail = new TicketDetail();
        $data = $request->all();

        $ticketDetail->fill($data);

        if (!$ticketDetail->isValid()) {
            return $this->respondWithError(['error' => $ticketDetail->getValidationErrors()]);
        }
        try {
            $ticketDetail->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$ticketDetail]);
    }

    public function delete($id){

        $ticketDetail  = TicketDetail::find($id);
        if (!$ticketDetail) {
            return $this->respondNotFound();
        }
        try {
            if (!$ticketDetail->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $ticketDetail = TicketDetail::find($id);
        if(!$ticketDetail) {
            return $this->respondNotFound();
        }
        $data = $request->all();

        $ticketDetail->fill($data);

        if (!$ticketDetail->isValid()) {
            return $this->respondWithError(['error' => $ticketDetail->getValidationErrors()]);
        }
        try {
            $ticketDetail->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$ticketDetail]);
    }
}
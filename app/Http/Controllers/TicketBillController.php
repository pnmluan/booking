<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 10:21 PM
 */

namespace App\Http\Controllers;


use App\Models\TicketBill;
use Illuminate\Http\Request;

class TicketBillController extends ApiController
{
    public function index(Request $request){

        $data = TicketBill::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $ticketBill  = TicketBill::find($id);

        if (!$ticketBill) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$ticketBill]);
    }

    public function create(Request $request){
        $ticketBill = new TicketBill();
        $data = $request->all();

        $ticketBill->fill($data);

        if (!$ticketBill->isValid()) {
            return $this->respondWithError(['error' => $ticketBill->getValidationErrors()]);
        }
        try {
            $ticketBill->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$ticketBill]);
    }

    public function delete($id){

        $ticketBill  = TicketBill::find($id);
        if (!$ticketBill) {
            return $this->respondNotFound();
        }
        try {
            if (!$ticketBill->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $ticketBill = TicketBill::find($id);
        if(!$ticketBill) {
            return $this->respondNotFound();
        }
        $data = $request->all();

        $ticketBill->fill($data);

        if (!$ticketBill->isValid()) {
            return $this->respondWithError(['error' => $ticketBill->getValidationErrors()]);
        }
        try {
            $ticketBill->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$ticketBill]);
    }
}
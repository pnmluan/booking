<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 10:21 PM
 */

namespace App\Http\Controllers;


use App\Models\CategoryTicket;
use Illuminate\Http\Request;

class CategoryTicketController extends ApiController
{
    public function index(Request $request){

        $data = CategoryTicket::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $categoryTicket  = CategoryTicket::find($id);

        if (!$categoryTicket) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$categoryTicket]);
    }

    public function create(Request $request){
        $categoryTicket = new categoryTicket();
        $data = $request->all();

        $categoryTicket->fill($data);

        if (!$categoryTicket->isValid()) {
            return $this->respondWithError(['error' => $categoryTicket->getValidationErrors()]);
        }
        try {
            $categoryTicket->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$categoryTicket]);
    }

    public function delete($id){

        $categoryTicket  = CategoryTicket::find($id);
        if (!$categoryTicket) {
            return $this->respondNotFound();
        }
        try {
            if (!$categoryTicket->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $categoryTicket = CategoryTicket::find($id);
        if(!$categoryTicket) {
            return $this->respondNotFound();
        }
        $data = $request->all();

        $categoryTicket->fill($data);

        if (!$categoryTicket->isValid()) {
            return $this->respondWithError(['error' => $categoryTicket->getValidationErrors()]);
        }
        try {
            $categoryTicket->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$categoryTicket]);
    }
}
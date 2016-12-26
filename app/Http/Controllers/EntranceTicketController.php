<?php

namespace App\Http\Controllers;

use Input;
use App\Models\entranceTicket;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class entranceTicketController extends ApiController{

    public function index(Request $request){

        $data = EntranceTicket::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $entranceTicket  = EntranceTicket::find($id);

        if (!$entranceTicket) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$entranceTicket]);
    }

    protected function uploadImage($image) {
        if($image) {
            $filename  = time() . '.' . $image->getClientOriginalExtension();

            $destinationPath = 'backend/assets/apps/img/entranceTicket'; // upload path

            $image->move($destinationPath, $filename); // uploading file to given path

            return $filename;
        }
        return null;

    }

    public function create(Request $request){
        $entranceTicket = new entranceTicket();
        $data = $request['data'];

        $img = $this->uploadImage($request->file('img'));
        if($img) {
            $data['img'] = $img;
        }

        $entranceTicket->fill($data);

        if (!$entranceTicket->isValid()) {
            return $this->respondWithError(['error' => $entranceTicket->getValidationErrors()]);
        }
        try {
            $entranceTicket->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$entranceTicket]);
    }

    public function delete($id){

        $entranceTicket  = EntranceTicket::find($id);
        if (!$entranceTicket) {
            return $this->respondNotFound();
        }
        try {
            if (!$entranceTicket->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $entranceTicket = EntranceTicket::find($id);
        if(!$entranceTicket) {
            return $this->respondNotFound();
        }
        $data = $request['data'];
        $img = $this->uploadImage($request->file('img'));
        if($img) {
            $data['img'] = $img;
        }

        $entranceTicket->fill($data);

        if (!$entranceTicket->isValid()) {
            return $this->respondWithError(['error' => $entranceTicket->getValidationErrors()]);
        }
        try {
            $entranceTicket->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$entranceTicket]);
    }
}
?>
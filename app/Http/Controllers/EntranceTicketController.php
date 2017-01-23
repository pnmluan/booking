<?php

namespace App\Http\Controllers;

use Input;
use App\Models\EntranceTicket;
use App\Models\AlbumTicket;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class EntranceTicketController extends ApiController{
    private $path = 'backend/assets/apps/img/album_ticket';

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

   public function create(Request $request){
        $entranceTicket = new EntranceTicket();
        $data = $request->all();

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
            } else {
                $removedModels  = AlbumTicket::where(['entrance_ticket_id' => $id])->get();
                
                foreach ($removedModels as $key => $value) {

                    $value->delete();
                    unlink($this->path . '/' . $value->img);
                }
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
        $data = $request->all();

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
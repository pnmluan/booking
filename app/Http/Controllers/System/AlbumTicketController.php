<?php

namespace App\Http\Controllers\System;

use Input;
use App\Http\Controllers\Controller;
use App\Models\AlbumTicket;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Exception\HttpResponseException;


class AlbumTicketController extends Controller{

    private $path = 'backend/assets/apps/img/album_ticket';

    public function index(Request $request){

        $data = AlbumTicket::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $albumTicket  = AlbumTicket::find($id);

        if (!$albumTicket) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$albumTicket]);
    }

    protected function uploadImage($images) {
        if($images) {
            $filenames = [];
            foreach ($images as $key => $image) {
               $filename  = time(). $key . '.' . $image->getClientOriginalExtension();

                $destinationPath = $this->path; // upload path

                $image->move($destinationPath, $filename); // uploading file to given path

                $filenames[] = $filename;
            }
            

            return $filenames;
        }
        return null;

    }

    public function create(Request $request){
        
        $data = $request['data'];
        $albumTickets = [];
        $imgs = $this->uploadImage($request->file('imgs'));

        if($imgs) {

            foreach ($imgs as $key => $img) {
                $albumTicket = new AlbumTicket();
                $data['img'] = $img;
                $albumTicket->fill($data);

                if (!$albumTicket->isValid()) {
                    return $this->respondWithError(['error' => $albumTicket->getValidationErrors()]);
                }
                try {
                    $albumTicket->save();
                    $albumTickets[] = $albumTicket;
                } catch (\Exception $ex) {
                    return $this->respondWithNotSaved();
                }
            }
            
        }

        if(isset($data['removed_imgs'])) {
            // Delete an array of files
            foreach ($data['removed_imgs'] as $key => $value) {

                $removedModel  = AlbumTicket::where(['img' => $value, 'entrance_ticket_id' => $data['entrance_ticket_id']]);
                $removedModel->delete();
                unlink($this->path . '/' . $value);
            }

            
        }

        return $this->respondWithCreated(['data'=>$albumTickets]);
    }

    public function delete($id){


        $albumTicket  = AlbumTicket::find($id);
        if (!$albumTicket) {
            return $this->respondNotFound();
        }
        try {
            if (!$albumTicket->delete()) {

                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $albumTicket = AlbumTicket::find($id);
        if(!$albumTicket) {
            return $this->respondNotFound();
        }
        $data = $request['data'];
        $img = $this->uploadImage($request->file('img'));
        if($img) {
            $data['img'] = $img;
        }

        $albumTicket->fill($data);

        if (!$albumTicket->isValid()) {
            return $this->respondWithError(['error' => $albumTicket->getValidationErrors()]);
        }
        try {
            $albumTicket->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$albumTicket]);
    }
}
?>
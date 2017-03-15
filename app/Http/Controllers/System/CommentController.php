<?php

namespace App\Http\Controllers\System;

use Input;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Exception\HttpResponseException;


class CommentController extends Controller{
    private $path = 'backend/assets/apps/img/comment';

    public function index(Request $request){

        $data = Comment::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $comment  = Comment::find($id);

        if (!$comment) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$comment]);
    }

    protected function uploadImage($image) {
        if($image) {
            $filename  = time() . '.' . $image->getClientOriginalExtension();

            $destinationPath = $this->path; // upload path

            $image->move($destinationPath, $filename); // uploading file to given path

            return $filename;
        }
        return null;

    }

    public function create(Request $request){
        $comment = new Comment();
        $data = $request['data'];

        $img = $this->uploadImage($request->file('img'));
        if($img) {
            $data['img'] = $img;
        }

        $comment->fill($data);

        if (!$comment->isValid()) {
            return $this->respondWithError(['error' => $comment->getValidationErrors()]);
        }
        try {
            $comment->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$comment]);
    }

    public function delete($id){

        $comment  = Comment::find($id);
        if (!$comment) {
            return $this->respondNotFound();
        }
        try {
            $filename = $this->path . '/' . $comment->img;
            if(file_exists($filename)) {
                unlink($filename);
            }

            if (!$comment->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $comment = Comment::find($id);
        if(!$comment) {
            return $this->respondNotFound();
        }
        $data = $request['data'];
        $img = $this->uploadImage($request->file('img'));
        if($img) {
            $filename = $this->path . '/' . $comment->img;
            if(file_exists($filename)) {
                unlink($filename);
            }
            
            $data['img'] = $img;
        }

        $comment->fill($data);

        if (!$comment->isValid()) {
            return $this->respondWithError(['error' => $comment->getValidationErrors()]);
        }
        try {
            $comment->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$comment]);
    }
}
?>
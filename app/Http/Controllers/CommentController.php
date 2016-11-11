<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class CommentController extends ApiController{

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

    public function create(Request $request){
        $comment = new Comment();
        $data = $request->all();
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
        $data = $request->all();
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
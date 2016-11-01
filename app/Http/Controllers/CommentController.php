<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class CommentController extends Controller{

    public function index(){
        $comment  = Comment::all();
        return response()->json($comment);
    }

    public function show($id) {
        $comment  = Comment::find($id);
        return response()->json($comment);
    }

    public function create(Request $request){
        $comment = new Comment();
        $comment->full_name = $request->input('full_name');
        $comment->content = $request->input('content');
        $comment->status = $request->input('status');
        $comment->save();

        return response()->json($comment);
    }

    public function delete($id){
        $comment  = Comment::find($id);
        $comment->delete();

        return response()->json('deleted');
    }

    public function update(Request $request, $id){
        $comment = Comment::find($id);
        $comment->full_name = $request->input('full_name');
        $comment->content = $request->input('content');
        $comment->status = $request->input('status');
        $comment->save();

        return response()->json($comment);
    }
}
?>
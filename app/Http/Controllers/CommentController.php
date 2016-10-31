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

    public function getComment($id) {
        $comment  = Comment::find($id);
        return response()->json($comment);
    }

    public function createComment(Request $request){
        $validator = Validator::make($request->all(), [
            'full_name' => 'required',
            'content' => 'required',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $comment = new Comment();
        $comment->full_name = $request->input('full_name');
        $comment->content = $request->input('content');
        $comment->status = $request->input('status');
        $comment->save();

        return response()->json($comment);
    }

    public function deleteComment($id){
        $comment  = Comment::find($id);
        $comment->delete();

        return response()->json('deleted');
    }

    public function updateComment(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'full_name' => 'required',
            'content' => 'required',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $comment = Comment::find($id);
        $comment->full_name = $request->input('full_name');
        $comment->content = $request->input('content');
        $comment->status = $request->input('status');
        $comment->save();

        return response()->json($comment);
    }
}
?>
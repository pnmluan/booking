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
  
    public function getComment($id){
  
        $comment  = Comment::find($id);
  
        return response()->json($comment);
    }
  
    public function createComment(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $comment = Comment::create($request->all());
  
        return response()->json($comment);
  
    }
  
    public function deleteComment($id){
        $comment  = Comment::find($id);
        $comment->delete();
 
        return response()->json('deleted');
    }
  
    public function updateComment(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $customer = $this->customer->query()->find($id);
        $customer->name = $request->input('name');
        $customer->phone = $request->input('phone');
        $customer->address = $request->input('address');
        $customer->save();
  
        return response()->json($comment);
    }
 
}
?>
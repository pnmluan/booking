<?php
  
namespace App\Http\Controllers;
  
use App\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
  
  
class CategoryController extends Controller{
  
	public function index(){
        $Categories  = Category::all();
  
        return response()->json($Categories);
  
    }
  
    public function getCategory($id){
  
        $Category  = Category::find($id);
  
        return response()->json($Category);
    }
  
    public function createCategory(Request $request){
  
        $Category = Category::create($request->all());
  
        return response()->json($Category);
  
    }
  
    public function deleteCategory($id){
        $Category  = Category::find($id);
        $Category->delete();
 
        return response()->json('deleted');
    }
  
    public function updateCategory(Request $request,$id){
        $Category  = Category::find($id);
        $Category->title = $request->input('name');
        $Category->author = $request->input('description');
        $Category->isbn = $request->input('status');
        $Category->save();
  
        return response()->json($Category);
    }
 
}
?>
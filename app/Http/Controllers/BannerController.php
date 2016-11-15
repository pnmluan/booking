<?php
  
namespace App\Http\Controllers;

use App\Models\Banner;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
  
  
class BannerController extends ApiController{
  
	public function index(){
        $Categories  = Banner::all();

        return response()->json($Categories);
  
    }
  
    public function show($id){
  
        $Banner  = Banner::find($id);
  
        return response()->json($Banner);
    }
  
    public function create(Request $request){
  
        $Banner = Banner::create($request->all());
  
        return response()->json($Banner);
  
    }
  
    public function delete($id){
        $Banner  = Banner::find($id);
        $Banner->delete();
 
        return response()->json('deleted');
    }
  
    public function update(Request $request,$id){
        $Banner  = Banner::find($id);
        $Banner->title = $request->input('name');
        $Banner->author = $request->input('description');
        $Banner->isbn = $request->input('status');
        $Banner->save();
  
        return response()->json($Banner);
    }
 
}
?>
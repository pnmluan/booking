<?php
  
namespace App\Http\Controllers;
  
use App\Banner;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
  
  
class BannerController extends Controller{
  
	public function index(){
        $Categories  = Banner::all();
  
        return response()->json($Categories);
  
    }
  
    public function getBanner($id){
  
        $Banner  = Banner::find($id);
  
        return response()->json($Banner);
    }
  
    public function createBanner(Request $request){
  
        $Banner = Banner::create($request->all());
  
        return response()->json($Banner);
  
    }
  
    public function deleteBanner($id){
        $Banner  = Banner::find($id);
        $Banner->delete();
 
        return response()->json('deleted');
    }
  
    public function updateBanner(Request $request,$id){
        $Banner  = Banner::find($id);
        $Banner->title = $request->input('name');
        $Banner->author = $request->input('description');
        $Banner->isbn = $request->input('status');
        $Banner->save();
  
        return response()->json($Banner);
    }
 
}
?>
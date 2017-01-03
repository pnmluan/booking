<?php
  
namespace App\Http\Controllers;
  
use App\Models\Banner;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
  
  
class BannerController extends ApiController{
    private $path = 'backend/assets/apps/img/banner';

	public function index(Request $request){

        $data = Banner::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $banner  = Banner::find($id);

        if (!$banner) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$banner]);
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
        $banner = new Banner();
        $data = $request['data'];

        $img = $this->uploadImage($request->file('img'));
        if($img) {
            $data['img'] = $img;
        }

        $banner->fill($data);

        if (!$banner->isValid()) {
            return $this->respondWithError(['error' => $banner->getValidationErrors()]);
        }

        try {
            $banner->save();
        } catch (\Exception $ex) {
            return $ex;
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$banner]);
    }

    public function delete($id){

        $banner  = Banner::find($id);
        if (!$banner) {
            return $this->respondNotFound();
        }
        try {
            unlink($this->path . '/' . $banner->img);
            if (!$banner->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $banner = Banner::find($id);
        if(!$banner) {
            return $this->respondNotFound();
        }
        $data = $request['data'];
        $img = $this->uploadImage($request->file('img'));
        if($img) {
            unlink($this->path . '/' . $banner->img);
            $data['img'] = $img;
        }

        $banner->fill($data);

        if (!$banner->isValid()) {
            return $this->respondWithError(['error' => $banner->getValidationErrors()]);
        }
        try {
            $banner->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$banner]);
    }
 
}
?>
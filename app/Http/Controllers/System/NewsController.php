<?php
  
namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Exception\HttpResponseException;
  
  
class NewsController extends Controller{
    private $path = 'backend/assets/apps/img/news';

	public function index(Request $request){

        $data = News::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $news  = News::find($id);

        if (!$news) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$news]);
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
        $news = new News();
        $data = $request['data'];

        $img = $this->uploadImage($request->file('img'));
        if($img) {
            $data['img'] = $img;
        }

        $news->fill($data);

        if (!$news->isValid()) {
            return $this->respondWithError(['error' => $news->getValidationErrors()]);
        }

        try {
            $news->save();
        } catch (\Exception $ex) {
            return $ex;
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$news]);
    }

    public function delete($id){

        $news  = News::find($id);
        if (!$news) {
            return $this->respondNotFound();
        }
        try {
            $filename = $this->path . '/' . $news->img;
            if(file_exists($filename)) {
                unlink($filename);
            }

            if (!$news->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $news = News::find($id);
        if(!$news) {
            return $this->respondNotFound();
        }
        $data = $request['data'];
        $img = $this->uploadImage($request->file('img'));
        if($img) {
            $filename = $this->path . '/' . $news->img;
            if(file_exists($filename)) {
                unlink($filename);
            }
            
            $data['img'] = $img;
        }

        $news->fill($data);

        if (!$news->isValid()) {
            return $this->respondWithError(['error' => $news->getValidationErrors()]);
        }
        try {
            $news->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$news]);
    }
 
}
?>
<?php
  
namespace App\Http\Controllers;
  
use App\Models\News;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
  
  
class NewsController extends ApiController{
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
            unlink($this->path . '/' . $news->img);
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
            unlink($this->path . '/' . $news->img);
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
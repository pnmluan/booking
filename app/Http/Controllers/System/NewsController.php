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

	/**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->table = 'news';
        $this->columns = \DB::getSchemaBuilder()->getColumnListing($this->table);
    }


    /**
     * Get info users for datatables
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){
        $params = $request->all();
        if(isset($request['has_data_table']) && $request['has_data_table']) {
            $data = Passenger::listItems($params);
            return $data;
        } else {

            $columns  = $this->columns;

            $limit          = 5000;
            $offset         = 0;

            $alias = 'MT';
            $alias_dot = $alias . '.';
            $select         = $alias_dot . '*';
            $query = \DB::table($this->table . ' AS ' . $alias)
                        ->select($select);
            /*==================================================
             * Filter Data
             *==================================================*/
            foreach ($columns as $field) {
                if(isset($params[$field]) || !empty($params[$field])){
                    if(is_array($params[$field])){
                        $query->where($alias_dot . $field, 'IN', $params[$field]);
                    }else{
                        switch ($field) {
                            case 'status':
                                $query->where($alias_dot . $field, '=', $params[$field]);
                                break;
                            default:
                                $query->where($alias_dot . $field, 'LIKE', '%' . $params[$field] . '%');
                                break;
                        }
                    }
                }
            }

            /*==================================================
             * Limit & Offset
             *==================================================*/
            $limit = (isset($params['limit']) || !empty($params['limit']))?$params['limit']:$limit;
            $offset = (isset($params['offset']) || !empty($params['offset']))?$params['offset']:$offset;


            /*==================================================
             * Process Query
             *==================================================*/
            $query->limit($limit)->offset($offset);
            $data = $query->get()->toArray();
            $total_data = count($data);
            /*==================================================
             * Response Data
             *==================================================*/
            return new JsonResponse([
                'message' => 'list_data',
                'total' => $total_data,
                'data' => $data
            ]);
        }

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
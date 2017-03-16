<?php

namespace App\Http\Controllers\System;

use Input;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Exception\HttpResponseException;


class CommentController extends Controller{
    private $path = 'backend/assets/apps/img/comment';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->table = 'comment';
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
            $data = Comment::listItems($params);
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

    /**
     * Get authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id) {

        $model  = Comment::find($id);

        if (empty($model)) {
            return new JsonResponse([
                'message' => 'no_data',
            ]);
        }

        return new JsonResponse([
            'message' => 'get_detail',
            'data' => $model
        ]);

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

    /**
     * Create/Update record into DB.
     *
     * @return JsonResponse
     */
    public function save(Request $request, $id = null){
        $data = $request['data'];
        $img = $this->uploadImage($request->file('img'));

        if(!empty($id)) {

            $model = Comment::find($id);
            if (!$model) {
                return new JsonResponse([
                    'message' => 'no_data',
                ]);
            }
            if($img) {
                $filename = $this->path . '/' . $model->img;
                if(file_exists($filename)) {
                    unlink($filename);
                }
                $data['img'] = $img;
            }

            
        } else {
            $model = new Comment();
            
            if($img) {
                $data['img'] = $img;
            }
        }
        

        $model->fill($data);

        if (!$model->isValid()) {
            return new JsonResponse([
                'message' => 'invalid',
                'error' => $model->getValidationErrors()
            ]);
        }
        try {
            $model->save();
        } catch (\Exception $ex) {
            return new JsonResponse([
                'message' => 'exception',
                'error' => $ex->getMessage()
            ]);
        }
        return new JsonResponse([
            'message' => 'created',
            'data' => $model
        ]);
    }

    /**
     * Remove record into DB.
     *
     * @return JsonResponse
     */
    public function delete($id){

        $model  = Comment::find($id);
        if (!$model) {
            return new JsonResponse([
                'message' => 'no_data',
            ]);
        }
        try {
            $filename = $this->path . '/' . $comment->img;
            if(file_exists($filename)) {
                unlink($filename);
            }

            if (!$model->delete()) {
                return new JsonResponse([
                    'message' => 'exception',
                    'error' => 'can not delete'
                ]);
            }
        } catch (\Exception $ex) {
            return new JsonResponse([
                'message' => 'exception',
                'error' => $ex->getMessage()
            ]);
        }
        return new JsonResponse([
            'message' => 'deleted',
            'rercord_id' => $id
        ]);
    }

}
?>
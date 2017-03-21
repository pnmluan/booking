<?php

namespace App\Http\Controllers\System;

use Input;
use App\Http\Controllers\Controller;
use App\Models\AlbumTicket;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Exception\HttpResponseException;


class AlbumTicketController extends Controller{

    private $path = 'backend/assets/apps/img/album_ticket';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->table = 'album_ticket';
        $this->columns = \DB::getSchemaBuilder()->getColumnListing($this->table);
    }


    /**
     * Get info table for datatables
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){
        $params = $request->all();
        if(isset($request['has_data_table']) && $request['has_data_table']) {
            $data = AlbumTicket::listItems($params);
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
                            case 'entrance_ticket_id':
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

        $model  = AlbumTicket::find($id);

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

    protected function uploadImage($images) {
        if($images) {
            $filenames = [];
            foreach ($images as $key => $image) {
               $filename  = time(). $key . '.' . $image->getClientOriginalExtension();

                $destinationPath = $this->path; // upload path

                $image->move($destinationPath, $filename); // uploading file to given path

                $filenames[] = $filename;
            }
            

            return $filenames;
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
        
        $pictures = [];
        $imgs = $this->uploadImage($request->file('imgs'));
        if($imgs) {

            foreach ($imgs as $key => $img) {
                $model = new AlbumTicket();
                $data['img'] = $img;
                $model->fill($data);

                try {
                    $model->save();
                    $pictures[] = $model;
                } catch (\Exception $ex) {
                    return new JsonResponse([
                        'message' => 'exception',
                        'error' => $ex->getMessage()
                    ]);
                }
            }
            
        }

        if(isset($data['removed_imgs'])) {
            // Delete an array of files
            foreach ($data['removed_imgs'] as $key => $value) {

                $removedModel  = AlbumTicket::where(['img' => $value, 'entrance_ticket_id' => $data['entrance_ticket_id']]);
                $removedModel->delete();
                unlink($this->path . '/' . $value);
            }

            
        }
    }

    /**
     * Remove record into DB.
     *
     * @return JsonResponse
     */
    public function delete($id){

        $model  = AlbumTicket::find($id);
        if (!$model) {
            return new JsonResponse([
                'message' => 'no_data',
            ]);
        }
        try {
            $filename = $this->path . '/' . $model->img;
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
            'message' => 'created',
            'rercord_id' => $id
        ]);
    }


}
?>
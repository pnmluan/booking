<?php

namespace App\Http\Controllers\System;

use Input;
use App\Http\Controllers\Controller;
use App\Models\EntranceTicket;
use App\Models\AlbumTicket;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Exception\HttpResponseException;


class EntranceTicketController extends Controller{
    private $path = 'backend/assets/apps/img/album_ticket';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->table = 'entrance_ticket';
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
            $data = EntranceTicket::listItems($params);
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
                            case 'category_ticket_id':
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
             * Except ID
             *==================================================*/
            if(isset($params['except_id'])) {
                $except_id = explode(',', $params['except_id']);
                $query->whereNotIn($alias_dot.'id', $except_id);
            }
            
            /*==================================================
             * Order
             *==================================================*/            
            if(isset($params['order_by'], $params['order'])){
                ($params['order_by'] == 'price') && $params['order_by'] = 'adult_fare';
                $query->orderBy($params['order_by'], $params['order']);
            }
            /*==================================================
             * Limit & Offset
             *==================================================*/
            $limit = (isset($params['limit']) || !empty($params['limit'])) ? $params['limit'] : $limit;
            $offset = (isset($params['offset']) || !empty($params['offset'])) ? $params['offset'] : $offset;

            /*==================================================
             * Process Query
             *==================================================*/
            $query->limit($limit)->offset($offset);
            $data = $query->get()->toArray();
            // Add album_ticket 
            foreach ($data as $key => $value) {
                $album = \DB::table('album_ticket')->where('entrance_ticket_id', $value->id)->get();
                $data[$key]->album = $album;
            }
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

        $model  = EntranceTicket::find($id);

        if (empty($model)) {
            return new JsonResponse([
                'message' => 'no_data',
            ]);
        }
        // Add album_ticket
        $model->album = \DB::table('album_ticket')->where('entrance_ticket_id', $model->id)->get();

        return new JsonResponse([
            'message' => 'get_detail',
            'data' => $model
        ]);

    }

    /**
     * Create/Update record into DB.
     *
     * @return JsonResponse
     */
    public function save(Request $request, $id = null){
        if(!empty($id)) {
            $model = EntranceTicket::find($id);

            if (!$model) {
                return new JsonResponse([
                    'message' => 'no_data',
                ]);
            }
        } else {
            $model = new EntranceTicket();
        }
        
        $data = $request->all();
        $data['clean_url'] = $this->toAscii($data['name']);
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

        $model  = EntranceTicket::find($id);
        if (!$model) {
            return new JsonResponse([
                'message' => 'no_data',
            ]);
        }
        try {
            if (!$model->delete()) {
                return new JsonResponse([
                    'message' => 'exception',
                    'error' => 'can not delete'
                ]);
            } else {
                $removedModels  = AlbumTicket::where(['entrance_ticket_id' => $id])->get();
                
                foreach ($removedModels as $key => $value) {

                    $value->delete();
                    unlink($this->path . '/' . $value->img);
                }
            }
        } catch (\Exception $ex) {
            return new JsonResponse([
                'message' => 'exception',
                'error' => $ex->getMessage()
            ]);
        }
        return new JsonResponse([
            'message' => 'deleted',
            'record_id' => $id
        ]);
    }
}
?>
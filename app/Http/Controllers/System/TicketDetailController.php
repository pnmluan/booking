<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 10:21 PM
 */

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\TicketDetail;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Exception\HttpResponseException;

class TicketDetailController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->table = 'ticket_detail';
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
            $data = TicketDetail::listItems($params);
            return $data;
        } else {

            $columns  = $this->columns;

            $limit          = 5000;
            $offset         = 0;

            $alias = 'MT';
            $alias_dot = $alias . '.';
            $select         = $alias_dot . '*';
            $query = \DB::table($this->table . ' AS ' . $alias)
                        ->select($select, \DB::raw('entrance_ticket.name AS ticket_name'), 'ticket_bill.code')
                        ->leftJoin('entrance_ticket', $alias_dot . 'entrance_ticket_id', '=', 'entrance_ticket.id')
                        ->leftJoin('ticket_bill', $alias_dot . 'ticket_bill_id', '=', 'ticket_bill.id');
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

        $model  = TicketDetail::find($id);

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

    /**
     * Create/Update record into DB.
     *
     * @return JsonResponse
     */
    public function save(Request $request, $id = null){
        if(!empty($id)) {
            $model = TicketDetail::find($id);

            if (!$model) {
                return new JsonResponse([
                    'message' => 'no_data',
                ]);
            }
        } else {
            $model = new TicketDetail();
        }

        $data = $request->all();
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

        $model  = TicketDetail::find($id);
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
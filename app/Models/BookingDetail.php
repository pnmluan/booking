<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 17-Nov-16
 * Time: 11:14 PM
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class BookingDetail extends BaseModel
{
    protected $table = 'booking_detail';
    protected $fillable = ['booking_id', 'from', 'start_time', 'start_date', 'to', 'end_time', 'end_date', 'round_trip', 'duration', 'provider', 'ticket_type', 'direction'];

    public function getModelValidations()
    {
        return [
            //'full_name' => 'required|string|' //. $this->getUniqueValidatorForField('full_name')
        ];
    }

    public static function listItems(array $param = null){

        $aColumns = ['booking_id', 'code', 'from', 'start_time', 'start_date', 'to', 'end_time', 'end_date', 'round_trip', 'duration', 'provider', 'ticket_type', 'direction'];

        $equalColumns = ['booking_id'];

        $query = \DB::table('booking_detail')
            ->select(\DB::raw('SQL_CALC_FOUND_ROWS id'),\DB::raw('id AS DT_RowId'),'booking_detail.*');

        // Filter search condition
        foreach ($aColumns as $key => $value) {
            if(in_array($value, $equalColumns)) {
                (isset($param[$value]) && $param[$value]) && $query->where($value,'=', $param[$value]);
            } else {
                (isset($param[$value]) && $param[$value]) && $query->where($value,'like','%'.$param[$value].'%');
            }
            
        }

        //======================= SEARCH =================
        if(isset($param['columns'])) {
            $sWhere = "";
            $count = count($param['columns']);
            if(isset($param['search']) && $param['search']['value']){
                $keyword = '%'. $param['search']['value'] .'%';
                for($i=0; $i<$count; $i++){
                    $requestColumn = $param['columns'][$i];
                    if($requestColumn['searchable']=='true'){
                        $sWhere .= $aColumns[$i].' LIKE "'.$keyword.'" OR ';
                    }
                }
                $sWhere = substr_replace( $sWhere, "", -4 );
            }
            /* Individual column filtering */
            for($i=0; $i<$count; $i++){
                $requestColumn = $param['columns'][$i];
                if ($requestColumn['searchable']=="true" && $requestColumn['search']['value'] != '' ){
                    if ($sWhere == "" ){
                        $sWhere = "WHERE ";
                    }else{
                        $sWhere .= " AND ";
                    }
                    $sWhere .= $aColumns[$i]." LIKE '%".mysql_real_escape_string($requestColumn['search']['value'])."%' ";
                }
            }

            if($sWhere != ""){
                $query->where(\DB::raw($sWhere));
            }
        }

        //======================= Ordering =================
        // $sOrder = '';
        // if (isset($param['order']) && count($param['order'])){
        // 	for ($i=0 ; $i<count($param['order']); $i++){
        // 		$columnIdx = intval($param['order'][$i]['column']);
        // 		$requestColumn = $param['columns'][$columnIdx];
        // 		if($requestColumn['orderable']=='true'){
        // 			$sOrder .= $aColumns[$columnIdx]." ". $param['order'][$i]['dir'] .", ";
        // 		}
        // 	}
        // 	$sOrder = substr_replace( $sOrder, "", -2 );
        // 	$sOrder && $query->orderBy(\DB::raw($sOrder));
        // }
        //======================= Paging =================
        (isset($param['start']) && $param['length']!=-1) && $query->limit($param['length'])->offset($param['start']);

        // $query = preg_replace('# null#', '', $query);

        $data = $query->get();

        // Add album_ticket 
        foreach ($data as $key => $value) {
            $passenger = \DB::table('passenger')
            ->select('passenger.*', 'fare.*', \DB::raw('baggage_type.fare AS baggage_type_fare'), \DB::raw('baggage_type.name AS baggage_type_name'), 'baggage_type.provider')
            ->leftJoin('fare', 'fare.passenger_id', '=', 'passenger.id')
            ->leftJoin('baggage_type', 'fare.baggage_type_id', '=', 'baggage_type.id')
            ->where('booking_detail_id', $value->id)->get();
            $data[$key]->passengers = $passenger;
        }


        \DB::setFetchMode(\PDO::FETCH_ASSOC);
        $total = \DB::select('SELECT FOUND_ROWS() as rows');


        $draw = 0;
        if(isset($param['draw'])) {
            $draw  = $param['draw'];
        }

        return [
            'draw' => $draw,
            'data' => $data,
            'recordsTotal' => $total[0]['rows'],
            'recordsFiltered' => $total[0]['rows'],
        ];
    }
}
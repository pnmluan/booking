<?php 
namespace App\Models;
  
use Illuminate\Database\Eloquent\Model;

class TicketDetail extends BaseModel
{
    protected $table = 'ticket_detail';
    protected $fillable = ['adult', 'entrance_ticket_id', 'children', 'ticket_bill_id'];

    public function getModelValidations()
    {
        return [
            //'full_name' => 'required|string|' //. $this->getUniqueValidatorForField('full_name')
        ];
    }

    public static function listItems(array $param = null){

        $aColumns = ['adult', 'entrance_ticket_id', 'children', 'ticket_bill_id', 'ticket_name', 'adult_fare', 'children_fare'];
        $equalColumns = ['ticket_bill_id'];

        $query = \DB::table('ticket_detail')
            ->select(\DB::raw('SQL_CALC_FOUND_ROWS ticket_detail.id'),\DB::raw('ticket_detail.id AS DT_RowId'),'ticket_detail.*', \DB::raw('entrance_ticket.name AS ticket_name'), 'entrance_ticket.adult_fare', 'entrance_ticket.children_fare')
            ->leftJoin('entrance_ticket', 'ticket_detail.entrance_ticket_id', '=', 'entrance_ticket.id');

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
?>
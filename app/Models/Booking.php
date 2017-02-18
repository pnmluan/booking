<?php 
namespace App\Models;
  
use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;
  
class Booking extends BaseModel
{
    protected $table = 'booking'; 
    protected $fillable = ['code','round_trip', 'adult', 'children', 'infant', 'remark', 'state', 'status'];

    public function getModelValidations()
    {
        return [
            // 'full_name' => 'required|string|' //. $this->getUniqueValidatorForField('full_name')
        ];
    }

    public static function listItems(array $param = null){

        $aColumns = ['booking.code','booking.round_trip', 'booking.adult', 'booking.children', 'booking.infant', 'booking.state',  'contact.phone', 'contact.email', 'contact.requirement'];

        $query = \DB::table('booking')
            ->select(\DB::raw('SQL_CALC_FOUND_ROWS booking.id'),\DB::raw('booking.id AS DT_RowId'),'booking.*', 'contact.fullname', 'contact.phone', 'contact.email', 'contact.requirement')
            ->leftJoin('contact', 'booking.id', '=', 'contact.booking_id');

        // Filter search condition
        foreach ($aColumns as $key => $value) {
            (isset($param[$value]) && $param[$value]) && $query->where($value,'like','%'.$param[$value].'%');
        }

        //======================= SEARCH =================
        if(isset($param['columns'])) {
            $sWhere = "";
            $count = count($aColumns);
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
            // for($i=0; $i<$count; $i++){
            //     $requestColumn = $param['columns'][$i];
            //     if ($requestColumn['searchable']=="true" && $requestColumn['search']['value'] != '' ){
            //         if ($sWhere == "" ){
            //             $sWhere = "WHERE ";
            //         }else{
            //             $sWhere .= " AND ";
            //         }
            //         $sWhere .= $aColumns[$i]." LIKE '%".mysql_real_escape_string($requestColumn['search']['value'])."%' ";
            //     }
            // }

            if($sWhere != ""){
                $query->where(\DB::raw($sWhere));
            }
        }

        //======================= Ordering =================
        $query->orderBy('booking.state', 'desc');
        $query->orderBy('booking.created_at', 'asc');
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
<?php 
namespace App\Models;
  
use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;
  
class EntranceTicket extends BaseModel
{
    protected $table = 'entrance_ticket'; 
    protected $fillable = ['name', 'category_ticket_id', 'adult_fare', 'children_fare', 'description', 'content', 'include', 'not_include', 'notice', 'support', 'longitude', 'latitude', 'created_at'];

    public function getModelValidations()
    {
        return [
            // 'full_name' => 'required|string|' //. $this->getUniqueValidatorForField('full_name')
        ];
    }

    public static function listItems(array $param = null){

        $aColumns = ['entrance_ticket.name', 'category_ticket_id', 'category_ticket.name', 'entrance_ticket.adult_fare', 'entrance_ticket.children_fare', 'entrance_ticket.description', 'entrance_ticket.created_at'];

        $query = \DB::table('entrance_ticket')
            ->select(\DB::raw('SQL_CALC_FOUND_ROWS entrance_ticket.id'),\DB::raw('entrance_ticket.id AS DT_RowId'),'entrance_ticket.*', \DB::raw('category_ticket.name AS category_ticket_name')
            	// , 'album_ticket.name', 'album_ticket.url', 'album_ticket.email', 'album_ticket.requirement'
            	)
            ->leftJoin('category_ticket', 'entrance_ticket.category_ticket_id', '=', 'category_ticket.id');
            // ->leftJoin('album_ticket', 'entrance_ticket.id', '=', 'album_ticket.entrance_ticket_id');

        // Filter search condition
        foreach ($aColumns as $key => $value) {
            (isset($param[$value]) && $param[$value]) && $query->where($value,'like','%'.$param[$value].'%');
        }

        if(isset($param['except_id'])) {
            $query->where('entrance_ticket.id','!=', $param['except_id']);
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
            $album = \DB::table('album_ticket')->where('entrance_ticket_id', $value->id)->get();
            $data[$key]->album = $album;
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
?>
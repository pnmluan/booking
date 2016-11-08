<?php 
namespace App\Models;
  
use Illuminate\Database\Eloquent\Model;
  
class Location extends BaseModel
{
    protected $table = 'location'; 
    protected $fillable = ['code', 'name'];
     
    public function getModelValidations()
	{
		return [
			'code' => 'required|string|' . $this->getUniqueValidatorForField('code'),
			'name' => 'required|string|' . $this->getUniqueValidatorForField('name')
		];
	}

	public static function listItems(array $param = null){

		$aColumns = ['name','code'];
		
		$query = \DB::table('location')
					->select(\DB::raw('SQL_CALC_FOUND_ROWS id'),\DB::raw('id AS DT_RowId'),'location.*');
		//search by name
		(isset($param['name']) && $param['name']) && $query->where('name','like','%'.$param['name'].'%');
		//search by code
		(isset($param['code']) && $param['code']) && $query->where('code','like','%'.$param['code'].'%');

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
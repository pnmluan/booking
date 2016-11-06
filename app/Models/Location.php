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
}
?>
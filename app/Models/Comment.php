<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends BaseModel
{
    protected $table = 'comment';
    protected $fillable = ['full_name', 'content', 'status', 'created_at', 'updated_at'];

     public function getModelValidations()
	{
		return [
			'full_name' => 'required|string|' //. $this->getUniqueValidatorForField('full_name')
		];
	}
}
?>
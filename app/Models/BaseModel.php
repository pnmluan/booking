<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Validator;
class BaseModel extends Model
{

	protected $validationErrors = [];

	public function getModelValidations()
	{
		return [
			// 'id' => 'required|string|' . $this->getUniqueValidatorForField('id')
		];
	}
	protected function getUniqueValidatorForField($field)
	{
		return 'unique:' . $this->table . ',' . $field . ',' . ($this->exists ? $this->id : 'NULL');
	}
	public function isValid()
	{
		$this->validationErrors = [];
		$validations = $this->getModelValidations();
		$data = [];
		foreach ($validations as $attr => $rules) {
			$data[$attr] = $this->{$attr};
		}
    	$validator = Validator::make($data, $validations);
    	if ($validator->fails()) {
            $this->validationErrors = $validator->errors()->toArray();
            return false;
        }
        return true;
	}
	public function getValidationErrors()
	{
		return $this->validationErrors;
	}

}
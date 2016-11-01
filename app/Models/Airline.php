<?php 
namespace App;
  
use Illuminate\Database\Eloquent\Model;
  
class Airline extends Model
{
 	protected $table = 'airlines';    
    protected $fillable = ['name'];
     
}
?>
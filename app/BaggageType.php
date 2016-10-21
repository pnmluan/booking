<?php 
namespace App;
  
use Illuminate\Database\Eloquent\Model;
  
class BaggageType extends Model
{
    protected $table = 'baggage_type';
    protected $fillable = ['name'];
     
}
?>
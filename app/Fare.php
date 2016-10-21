<?php 
namespace App;
  
use Illuminate\Database\Eloquent\Model;
  
class Fare extends Model
{
    protected $table = 'fare'; 
    protected $fillable = ['passenger_id', 'one_way', 'fare', 'charge', 'tax'];
     
}
?>
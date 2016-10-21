<?php 
namespace App;
  
use Illuminate\Database\Eloquent\Model;
  
class Flight extends Model
{
     
     protected $fillable = ['booking_id', 'flight', 'depart', 'departure', 'arrive', 'arrival', 'one_way', 'depart_duration', 'return_duration', 'location_id'];
     
}
?>
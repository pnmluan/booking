<?php 
namespace App;
  
use Illuminate\Database\Eloquent\Model;
  
class Booking extends Model
{
    protected $table = 'booking'; 
    protected $fillable = ['one_way', 'adult', 'children', 'infant', 'baggage_type_id', 'ticket_type_id', 'remark'];
     
}
?>
<?php 
namespace App;
  
use Illuminate\Database\Eloquent\Model;
  
class Passenger extends Model
{
    protected $table = 'pasengers'; 
    protected $fillable = ['booking_id', 'title', 'first_name', 'last_name', 'birthday', 'phone', 'email'];
     
}
?>
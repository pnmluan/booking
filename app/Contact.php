<?php 
namespace App;
  
use Illuminate\Database\Eloquent\Model;
  
class Contact extends Model
{
    protected $table = 'contact'; 
    protected $fillable = ['booking_id', 'title', 'first_name', 'last_name', 'birthday', 'phone', 'email'];
     
}
?>
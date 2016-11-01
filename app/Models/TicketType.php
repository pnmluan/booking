<?php 
namespace App;
  
use Illuminate\Database\Eloquent\Model;
  
class TicketType extends Model
{
    protected $table = 'ticket_type'; 
    protected $fillable = ['code', 'name'];
     
}
?>
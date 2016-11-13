<?php 
namespace App\Models;
  
use Illuminate\Database\Eloquent\Model;
  
class TicketType extends Model
{
    protected $table = 'ticket_type'; 
    protected $fillable = ['provider', 'name'];
     
}
?>
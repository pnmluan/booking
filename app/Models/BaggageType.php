<?php 
namespace App\Models;
  
use Illuminate\Database\Eloquent\Model;

class BaggageType extends Model
{
    protected $table = 'baggage_type';
    protected $fillable = ['provider_id', 'name', 'fare'];
     
}
?>
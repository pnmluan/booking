<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
     protected $table = 'comment';
     protected $fillable = ['full_name', 'content', 'status', 'created_at', 'updated_at'];
}
?>
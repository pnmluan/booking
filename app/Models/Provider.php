<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 9:09 AM
 */

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    protected $table = 'provider';
    protected $fillable = ['name'];
}
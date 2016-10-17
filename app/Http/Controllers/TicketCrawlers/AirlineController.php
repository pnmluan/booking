<?php

namespace App\Http\Controllers\TicketCrawlers;

use App\Http\Controllers\Controller;


class AirlineController extends Controller
{
    public function index(){
        $arr = ['api'=> 'test'];
  
        return response()->json($arr);
  
    }
}

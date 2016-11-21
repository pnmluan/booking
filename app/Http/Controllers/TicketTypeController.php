<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 10:45 AM
 */

namespace App\Http\Controllers;


use App\Models\TicketType;

class TicketTypeController extends ApiController
{
    public function index(){
        $Categories  = TicketType::all();

        return response()->json($Categories);

    }

    public function show($id){

        $ticketType  = TicketType::find($id);

        return response()->json($ticketType);
    }

    public function create(Request $request){

        $ticketType = TicketType::create($request->all());

        return response()->json($ticketType);

    }

    public function delete($id){
        $ticketType  = TicketType::find($id);
        $ticketType->delete();

        return response()->json('deleted');
    }

    public function update(Request $request,$id){
        $ticketType  = TicketType::find($id);
        $ticketType->name = $request->input('name');
        $ticketType->provider = $request->input('provider');
        $ticketType->save();

        return response()->json($ticketType);
    }
}